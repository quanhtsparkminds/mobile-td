#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Handlebars = require('handlebars');
const { program } = require('commander');
const chalk = require('chalk');

// Register Handlebars helpers
Handlebars.registerHelper('capitalize', (str) => 
  str.charAt(0).toUpperCase() + str.slice(1)
);

Handlebars.registerHelper('camelCase', (str) => 
  str.charAt(0).toLowerCase() + str.slice(1)
);

Handlebars.registerHelper('upperCase', (str) => 
  str.toUpperCase()
);

Handlebars.registerHelper('kebabCase', (str) =>
  str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
);

Handlebars.registerHelper('eq', (a, b) => a === b);

Handlebars.registerHelper('or', (...args) => {
  // Remove the last argument which is the options object
  const values = args.slice(0, -1);
  return values.some(value => value);
});

Handlebars.registerHelper('hasEnums', (fields) => {
  return fields && Array.isArray(fields) && fields.some(field => field.isEnum);
});

Handlebars.registerHelper('includes', (array, value) => 
  Array.isArray(array) && array.includes(value)
);

Handlebars.registerHelper('hasMutations', (operations) => {
  return operations.create?.enabled || operations.update?.enabled || operations.delete?.enabled;
});

// Helper to generate object type structure
Handlebars.registerHelper('generateObjectType', function(properties) {
  if (!properties || !Array.isArray(properties)) return 'Record<string, any>';
  
  const fields = properties.map(prop => {
    const optional = prop.isRequired ? '' : '?';
    let type;
    
    if (prop.isEnum) {
      type = `E${this.name}${prop.name.charAt(0).toUpperCase() + prop.name.slice(1)}`;
    } else if (prop.isArray) {
      const itemType = prop.items?.type === 'string' ? 'string' : 
                      prop.items?.type === 'number' ? 'number' : 
                      prop.items?.type === 'boolean' ? 'boolean' : 'any';
      type = `Array<${itemType}>`;
    } else if (prop.isObject && prop.properties) {
      // Recursively handle nested objects
      type = Handlebars.helpers.generateObjectType.call(this, prop.properties);
    } else {
      type = prop.type === 'string' ? 'string' :
             prop.type === 'number' ? 'number' :
             prop.type === 'boolean' ? 'boolean' :
             prop.type === 'object' ? 'Record<string, any>' : prop.type;
    }
    
    const comment = prop.description ? `/** ${prop.description} */\n    ` : '';
    return `${comment}${prop.name}${optional}: ${type};`;
  }).join('\n    ');
  
  return `{\n    ${fields}\n  }`;
});

// Helper to collect unique custom types
Handlebars.registerHelper('getUniqueCustomTypes', function(fields) {
  const customTypes = new Set();
  
  if (!fields || !Array.isArray(fields)) return [];
  
  fields.forEach(field => {
    let itemType = null;
    
    // Handle array types: Array<TCurrency>
    if (field.isArray && field.items && field.items.type) {
      itemType = field.items.type;
    }
    // Handle direct custom types: TCurrency
    else if (field.type && !['string', 'number', 'boolean', 'object', 'array'].includes(field.type)) {
      itemType = field.type;
    }
    
    // Only collect custom types (not primitive types)
    if (itemType && !['string', 'number', 'boolean', 'object'].includes(itemType)) {
      // Remove 'T' prefix to get file name (TCurrency -> Currency)
      const fileName = itemType.startsWith('T') ? itemType.slice(1) : itemType;
      customTypes.add(JSON.stringify({
        typeName: itemType,    // TCurrency
        fileName: fileName     // Currency
      }));
    }
  });
  
  // Convert back to objects and return
  return Array.from(customTypes).map(jsonStr => JSON.parse(jsonStr));
});

Handlebars.registerHelper('getCurrentDate', () => new Date().toISOString());

class CodeGenerator {
  constructor() {
    this.templatesPath = path.join(__dirname, '../templates');
    this.outputPath = path.join(process.cwd(), 'src/generated');
  }

  /**
   * Load schema from YAML file
   */
  loadSchema(schemaPath) {
    try {
      const fullPath = path.resolve(schemaPath);
      const content = fs.readFileSync(fullPath, 'utf8');
      return yaml.load(content);
    } catch (error) {
      console.error(chalk.red(`Error loading schema: ${error.message}`));
      process.exit(1);
    }
  }

  /**
   * Load and compile Handlebars template
   */
  loadTemplate(templateName) {
    const templatePath = path.join(this.templatesPath, `${templateName}.hbs`);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }
    const content = fs.readFileSync(templatePath, 'utf8');
    return Handlebars.compile(content);
  }

  /**
   * Ensure directory exists
   */
  ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Process field definitions for template
   */
  processFields(fields) {
    return Object.entries(fields).map(([name, config]) => ({
      name,
      ...config,
      isRequired: config.required === true,
      isReadonly: config.readonly === true,
      isEnum: config.type === 'enum' || !!config.enum,
      isArray: config.type === 'array',
      isObject: config.type === 'object',
      properties: config.properties ? this.processFields(config.properties) : undefined,
    }));
  }

  /**
   * Generate TypeScript types
   */
  generateTypes(schema) {
    console.log(chalk.blue('📝 Generating types...'));
    
    const template = this.loadTemplate('types');
    const processedFields = this.processFields(schema.fields || {});
    
    const context = {
      name: schema.name,
      fields: processedFields,
      operations: schema.operations || {},
      date: new Date().toISOString(),
    };

    const content = template(context);
    
    const outputPath = path.join(this.outputPath, 'types', `${schema.name}.types.ts`);
    this.ensureDir(path.dirname(outputPath));
    fs.writeFileSync(outputPath, content);
    
    console.log(chalk.green(`✅ Generated: ${outputPath}`));
  }

  generateEnums(schema) {
    console.log(chalk.blue('🔢 Generating enums...'));
    
    const template = this.loadTemplate('enum');
    const processedFields = this.processFields(schema.fields || {});
    
    const context = {
      name: schema.name,
      fields: processedFields,
      date: new Date().toISOString(),
    };

    const content = template(context);
    
    const outputPath = path.join(this.outputPath, 'enums', `${schema.name}.enum.ts`);
    this.ensureDir(path.dirname(outputPath));
    fs.writeFileSync(outputPath, content);
    
    console.log(chalk.green(`✅ Generated: ${outputPath}`));
  }

  /**
   * Generate API service
   */
  generateApiService(schema) {
    console.log(chalk.blue('🌐 Generating API service...'));
    
    const serviceDir = path.join(this.outputPath, 'api', schema.name.toLowerCase());
    this.ensureDir(serviceDir);
    
    // Generate API service
    const apiTemplate = this.loadTemplate('api-service');
    const processedFields = this.processFields(schema.fields || {});
    
    const context = {
      name: schema.name,
      plural: schema.plural,
      endpoint: schema.endpoint,
      fields: processedFields,
      operations: schema.operations || {},
      camelName: schema.name.charAt(0).toLowerCase() + schema.name.slice(1),
      date: new Date().toISOString(),
    };

    const apiContent = apiTemplate(context);
    const apiOutputPath = path.join(serviceDir, `${schema.name}.api.ts`);
    fs.writeFileSync(apiOutputPath, apiContent);
    console.log(chalk.green(`✅ Generated: ${apiOutputPath}`));
    
    // Generate API types
    const typesTemplate = this.loadTemplate('api-types');
    const typesContent = typesTemplate(context);
    const typesOutputPath = path.join(serviceDir, `${schema.name}.api.types.ts`);
    fs.writeFileSync(typesOutputPath, typesContent);
    console.log(chalk.green(`✅ Generated: ${typesOutputPath}`));
  }

  /**
   * Generate React Query hooks
   */
  generateHooks(schema) {
    console.log(chalk.blue('🪝 Generating React Query hooks...'));
    
    const template = this.loadTemplate('hooks');
    const processedFields = this.processFields(schema.fields || {});
    
    const context = {
      name: schema.name,
      plural: schema.plural,
      fields: processedFields,
      operations: schema.operations || {},
      camelName: schema.name.charAt(0).toLowerCase() + schema.name.slice(1),
      config: schema.config || {},
      date: new Date().toISOString(),
    };

    const content = template(context);
    
    const outputPath = path.join(this.outputPath, 'hooks', `${schema.name}.hooks.ts`);
    this.ensureDir(path.dirname(outputPath));
    fs.writeFileSync(outputPath, content);
    
    console.log(chalk.green(`✅ Generated: ${outputPath}`));
  }

  /**
   * Update index files
   */
  updateIndexFiles(schema) {
    console.log(chalk.blue('📁 Updating index files...'));
    
    // Always create all 4 main folders
    const folders = ['types', 'enums', 'api', 'hooks'];
    folders.forEach(folder => {
      this.ensureDir(path.join(this.outputPath, folder));
    });
    
    const indexFiles = [
      { path: 'types/index.ts', export: `export * from './${schema.name}.types';` },
      { path: 'enums/index.ts', export: `export * from './${schema.name}.enum';` },
      { path: `api/${schema.name.toLowerCase()}/index.ts`, export: `export * from './${schema.name}.api';\nexport * from './${schema.name}.api.types';` },
      { path: 'api/index.ts', export: `export * from './${schema.name.toLowerCase()}';` },
      { path: 'hooks/index.ts', export: `export * from './${schema.name}.hooks';` },
    ];

    indexFiles.forEach(({ path: indexPath, export: exportLine }) => {
      const fullPath = path.join(this.outputPath, indexPath);
      
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (!content.includes(exportLine)) {
          fs.appendFileSync(fullPath, `${exportLine}\n`);
        }
      } else {
        this.ensureDir(path.dirname(fullPath));
        fs.writeFileSync(fullPath, exportLine + '\n');
      }
    });
    
    // Create main index file
    const mainIndexTemplate = this.loadTemplate('main-index');
    const mainIndexContent = mainIndexTemplate({});
    const mainIndexPath = path.join(this.outputPath, 'index.ts');
    fs.writeFileSync(mainIndexPath, mainIndexContent);
    
    console.log(chalk.green('✅ Updated index files'));
  }

  /**
   * Generate all code from schema
   */
  async generate(schemaPath) {
    console.log(chalk.cyan('🚀 Starting BaroPlate code generation...\n'));
    
    const schema = this.loadSchema(schemaPath);
    console.log(chalk.yellow(`📋 Loaded schema: ${schema.name}`));
    
    try {
      this.generateTypes(schema);
      this.generateEnums(schema);
      this.generateApiService(schema);
      this.generateHooks(schema);
      this.updateIndexFiles(schema);
      
      console.log(chalk.green.bold('\n🎉 Code generation completed successfully!'));
      console.log(chalk.gray('\n📝 Generated files:'));
      console.log(chalk.gray(`  - src/generated/types/${schema.name}.types.ts`));
      console.log(chalk.gray(`  - src/generated/enums/${schema.name}.enum.ts`));
      console.log(chalk.gray(`  - src/generated/api/${schema.name.toLowerCase()}/${schema.name}.api.ts`));
      console.log(chalk.gray(`  - src/generated/api/${schema.name.toLowerCase()}/${schema.name}.api.types.ts`));
      console.log(chalk.gray(`  - src/generated/hooks/${schema.name}.hooks.ts`));
      console.log(chalk.gray('\n🚀 Next steps:'));
      console.log(chalk.gray('  1. Review generated files'));
      console.log(chalk.gray('  2. Create custom service layer if needed'));
      console.log(chalk.gray('  3. Import and use in your components'));
      console.log(chalk.gray(`  4. Example: import { use${schema.name}ListQuery } from '@/generated/hooks/${schema.name}.hooks';`));
      
    } catch (error) {
      console.error(chalk.red(`❌ Generation failed: ${error.message}`));
      console.error(error.stack);
      process.exit(1);
    }
  }
}

// CLI setup
program
  .name('baroplate-codegen')
  .description('Generate API code for BaroPlate')
  .version('1.0.0');

program
  .command('api')
  .description('Generate API code from schema')
  .argument('<n>', 'API name (e.g., Product)')
  .option('-f, --from <schema>', 'Schema file path')
  .option('-o, --output <path>', 'Output directory', 'src/generated')
  .action(async (name, options) => {
    const generator = new CodeGenerator();
    
    let schemaPath = options.from;
    if (!schemaPath) {
      schemaPath = path.join(__dirname, '../schemas', `${name.toLowerCase()}.schema.yaml`);
    }
    
    if (!fs.existsSync(schemaPath)) {
      console.error(chalk.red(`❌ Schema file not found: ${schemaPath}`));
      console.log(chalk.yellow('💡 Create a schema file first or use --from option'));
      console.log(chalk.yellow(`💡 Try: npm run generate:init ${name}`));
      process.exit(1);
    }
    
    await generator.generate(schemaPath);
  });

program
  .command('init')
  .description('Initialize schema template')
  .argument('<n>', 'API name')
  .action((name) => {
    const schemaTemplate = `# ${name} Schema Definition
name: ${name}
plural: ${name.toLowerCase()}s
endpoint: /${name.toLowerCase()}s

# Entity fields
fields:
  id:
    type: string
    format: uuid
    required: true
    readonly: true
    description: "Unique identifier"
  
  name:
    type: string
    required: true
    minLength: 1
    maxLength: 100
    description: "${name} name"
  
  description:
    type: string
    maxLength: 500
    description: "${name} description"
  
  status:
    type: string
    enum: [ACTIVE, INACTIVE]
    default: ACTIVE
    description: "${name} status"
  
  createdAt:
    type: string
    format: date-time
    readonly: true
    description: "Creation timestamp"
  
  updatedAt:
    type: string
    format: date-time
    readonly: true
    description: "Last update timestamp"

# API operations to generate
operations:
  list:
    enabled: true
    params:
      - name: page
        type: number
        default: 1
        description: "Page number for pagination"
      - name: size
        type: number
        default: 20
        maximum: 100
        description: "Number of items per page"
      - name: sort
        type: string
        description: "Sort field and direction (e.g., 'name,asc' or 'createdAt,desc')"
      - name: search
        type: string
        description: "Search in name and description"
      - name: status
        type: string
        enum: [ACTIVE, INACTIVE]
        description: "Filter by status"
  
  detail:
    enabled: true
  
  create:
    enabled: true
  
  update:
    enabled: true
  
  delete:
    enabled: true

# Generation configuration
config:
  generateHooks: true
  caching: true
  optimisticUpdates: true
`;
    
    const schemaPath = path.join(__dirname, '../schemas', `${name.toLowerCase()}.schema.yaml`);
    const dir = path.dirname(schemaPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    if (fs.existsSync(schemaPath)) {
      console.log(chalk.yellow(`⚠️ Schema file already exists: ${schemaPath}`));
      console.log(chalk.gray('💡 Edit the existing file or delete it first'));
      return;
    }
    
    fs.writeFileSync(schemaPath, schemaTemplate);
    console.log(chalk.green(`✅ Created schema template: ${schemaPath}`));
    console.log(chalk.yellow(`💡 Next steps:`));
    console.log(chalk.yellow(`  1. Edit the schema file to add your fields`));
    console.log(chalk.yellow(`  2. Run: npm run generate:api ${name}`));
    console.log(chalk.yellow(`  3. Start using the generated code!`));
  });

if (require.main === module) {
  program.parse();
}

module.exports = CodeGenerator;