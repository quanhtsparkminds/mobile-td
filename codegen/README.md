# BaroPlate Schema Format Documentation

This document provides a complete guide to writing YAML schema files for the BaroPlate codegen system.

## 📁 File Structure

Schema files should be placed in `codegen/schemas/` and follow the naming convention:

```
{entity-name}.schema.yaml
```

Example: `product.schema.yaml`, `currency.schema.yaml`

## 🏗️ Basic Schema Structure

```yaml
# Entity naming and API configuration
name: EntityName
plural: entityNames
endpoint: /entity-names

# Field definitions
fields:
  # ... field definitions

# API operations configuration
operations:
  # ... operation definitions

# Generation configuration
config:
  # ... config options
```

## 📝 Entity Naming Configuration

### Required Fields

| Field      | Type   | Description                 | Example                    |
| ---------- | ------ | --------------------------- | -------------------------- |
| `name`     | string | Entity name (PascalCase)    | `Product`, `Currency`      |
| `plural`   | string | Plural form for collections | `products`, `currencies`   |
| `endpoint` | string | API endpoint path           | `/products`, `/currencies` |

**Generated Results:**

- Types: `T{name}`, `T{name}Create`, `T{name}Update`
- Files: `{name}.types.ts`, `{name}.api.ts`
- Hooks: `use{name}Query`, `use{name}ListQuery`

## 🔧 Field Definitions

Fields are defined under the `fields` key with the following structure:

```yaml
fields:
  fieldName:
    type: fieldType
    required: boolean
    readonly: boolean
    description: "Field description"
    # ... additional constraints
```

### Primitive Types

#### String Type

```yaml
name:
  type: string
  required: true
  minLength: 1
  maxLength: 100
  description: "Entity name"
```

**String Constraints:**

- `minLength: number` - Minimum string length
- `maxLength: number` - Maximum string length
- `format: uri` - URL format validation
- `format: date-time` - ISO datetime format

#### Number Type

```yaml
price:
  type: number
  required: true
  minimum: 0
  maximum: 1000000
  description: "Product price"
```

**Number Constraints:**

- `minimum: number` - Minimum value
- `maximum: number` - Maximum value

#### Boolean Type

```yaml
isActive:
  type: boolean
  required: true
  default: true
  description: "Whether entity is active"
```

### Complex Types

#### Enum Type

```yaml
status:
  type: string
  enum: [ACTIVE, INACTIVE, PENDING]
  default: ACTIVE
  description: "Entity status"
```

**Generated:** Creates enum `E{EntityName}Status` with values `ACTIVE`, `INACTIVE`, `PENDING`

#### Array Type (Primitive Items)

```yaml
tags:
  type: array
  items:
    type: string
  description: "List of tags"
```

**Generated TypeScript:** `string[]`

#### Array Type (Custom Type Items)

```yaml
currencies:
  type: array
  items:
    type: TCurrency
  required: true
  description: "List of currencies"
```

**Generated TypeScript:** `TCurrency[]` with automatic import from `./Currency.types`

#### Custom Type Reference

```yaml
currency:
  type: TCurrency
  required: true
  description: "Related currency"
```

**Generated TypeScript:** `TCurrency` with automatic import from `./Currency.types`

#### Object Type (Simple)

```yaml
metadata:
  type: object
  description: "Additional metadata"
```

**Generated TypeScript:** `Record<string, any>`

#### Object Type (Structured)

```yaml
dimensions:
  type: object
  description: "Product dimensions"
  properties:
    width:
      type: number
      required: true
      description: "Width in cm"
    height:
      type: number
      required: true
      description: "Height in cm"
    depth:
      type: number
      description: "Depth in cm"
```

**Generated TypeScript:**

```typescript
{
  width: number;
  height: number;
  depth?: number;
}
```

### Field Modifiers

| Modifier      | Type    | Description                                            | Default |
| ------------- | ------- | ------------------------------------------------------ | ------- |
| `required`    | boolean | Field is required                                      | `false` |
| `readonly`    | boolean | Field is read-only (excluded from Create/Update types) | `false` |
| `default`     | any     | Default value for the field                            | none    |
| `description` | string  | Field documentation                                    | none    |

### Complete Field Example

```yaml
fields:
  id:
    type: number
    required: true
    readonly: true
    description: "Unique identifier"

  name:
    type: string
    required: true
    minLength: 1
    maxLength: 100
    description: "Entity name"

  status:
    type: string
    enum: [ACTIVE, INACTIVE]
    default: ACTIVE
    description: "Entity status"

  price:
    type: number
    minimum: 0
    description: "Price in USD"

  isEnabled:
    type: boolean
    default: true
    description: "Whether entity is enabled"

  tags:
    type: array
    items:
      type: string
    description: "Entity tags"

  currency:
    type: TCurrency
    required: true
    description: "Related currency"

  metadata:
    type: object
    description: "Additional data"
    properties:
      version:
        type: number
        required: true
      author:
        type: string

  createdAt:
    type: string
    format: date-time
    readonly: true
    description: "Creation timestamp"
```

## 🌐 API Operations Configuration

### Operations Structure

```yaml
operations:
  list:
    enabled: boolean
    params: # List operation parameters
  detail:
    enabled: boolean
  create:
    enabled: boolean
  update:
    enabled: boolean
  delete:
    enabled: boolean
```

### List Operation Parameters

When `list.enabled: true`, you can define filter parameters:

```yaml
operations:
  list:
    enabled: true
    params:
      - name: search
        type: string
        description: "Search in name and description"

      - name: status
        type: string
        enum: [ACTIVE, INACTIVE]
        description: "Filter by status"

      - name: minPrice
        type: number
        minimum: 0
        description: "Minimum price filter"

      - name: isEnabled
        type: boolean
        description: "Filter by enabled status"

      - name: category
        type: enum
        enum: EProductCategory
        description: "Filter by category enum"
```

**Parameter Types:**

- `string` - Text filter
- `number` - Numeric filter with optional `minimum`/`maximum`
- `boolean` - Boolean filter
- `enum` - Reference to generated enum

### Generated API Methods

| Operation | Generated Method   | HTTP Method | Description                     |
| --------- | ------------------ | ----------- | ------------------------------- |
| `list`    | `getList(params?)` | GET         | Get paginated list with filters |
| `detail`  | `getById(id)`      | GET         | Get single entity by ID         |
| `create`  | `create(data)`     | POST        | Create new entity               |
| `update`  | `update(data)`     | PUT         | Update existing entity          |
| `delete`  | `delete(id)`       | DELETE      | Delete entity by ID             |

## ⚙️ Generation Configuration

```yaml
config:
  generateHooks: boolean # Generate React Query hooks
  caching: boolean # Enable query caching
  optimisticUpdates: boolean # Enable optimistic updates for mutations
```

### Configuration Options

| Option              | Type    | Description                             | Default |
| ------------------- | ------- | --------------------------------------- | ------- |
| `generateHooks`     | boolean | Generate React Query hooks              | `true`  |
| `caching`           | boolean | Enable React Query caching              | `true`  |
| `optimisticUpdates` | boolean | Enable optimistic updates for mutations | `false` |

**When `generateHooks: true`:**

- Generates `{Entity}.hooks.ts` with React Query hooks
- Creates query keys constants
- Includes mutation hooks with cache invalidation

**When `optimisticUpdates: true`:**

- Update mutations include optimistic UI updates
- Automatic rollback on error
- Better user experience for mutations

## 📋 Complete Example Schema

```yaml
# Product Schema Definition
name: Product
plural: products
endpoint: /products

# Entity fields
fields:
  id:
    type: string
    format: uuid
    required: true
    readonly: true
    description: "Unique product identifier"

  name:
    type: string
    required: true
    minLength: 1
    maxLength: 100
    description: "Product name"

  description:
    type: string
    maxLength: 1000
    description: "Product description"

  price:
    type: number
    required: true
    minimum: 0
    description: "Product price in USD"

  category:
    type: string
    enum: [ELECTRONICS, CLOTHING, BOOKS]
    required: true
    description: "Product category"

  isActive:
    type: boolean
    default: true
    description: "Whether product is active"

  images:
    type: array
    items:
      type: string
      format: uri
    description: "Product image URLs"

  currency:
    type: TCurrency
    required: true
    description: "Product currency"

  metadata:
    type: object
    description: "Additional product data"
    properties:
      weight:
        type: number
        minimum: 0
      dimensions:
        type: object
        required: true

  createdAt:
    type: string
    format: date-time
    readonly: true
    description: "Creation timestamp"

# API operations
operations:
  list:
    enabled: true
    params:
      - name: search
        type: string
        description: "Search in name and description"
      - name: category
        type: string
        enum: [ELECTRONICS, CLOTHING, BOOKS]
        description: "Filter by category"
      - name: minPrice
        type: number
        minimum: 0
        description: "Minimum price filter"
      - name: isActive
        type: boolean
        description: "Filter by active status"

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
```

## 🚀 Generated Code Structure

The above schema generates:

### Types (`Product.types.ts`)

```typescript
import type { EProductCategory } from "../enums/Product.enum";
import type { TCurrency } from "./Currency.types";

export type TProduct = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: EProductCategory;
  isActive?: boolean;
  images?: string[];
  currency: TCurrency;
  metadata?: Record<string, any>;
  createdAt: string;
};

export type TProductCreate = Omit<TProduct, "id" | "createdAt">;
export type TProductUpdate = Partial<Omit<TProduct, "id" | "createdAt">>;
```

### API Service (`Product.api.ts`)

```typescript
export const productApi = {
  getList: (params?: TProductListParams) => Promise<ApiResponse<TProduct[]>>,
  getById: (id: string) => Promise<ApiResponse<TProduct>>,
  create: (data: TProductCreate) => Promise<ApiResponse<TProduct>>,
  update: (data: TProductUpdate & { id: string }) =>
    Promise<ApiResponse<TProduct>>,
  delete: (id: string) => Promise<ApiResponse<boolean>>,
};
```

### React Query Hooks (`Product.hooks.ts`)

```typescript
export const useProductListQuery = (params?: TProductListParams) => {
  /* ... */
};
export const useProductQuery = (id: string) => {
  /* ... */
};
export const useCreateProductMutation = () => {
  /* ... */
};
export const useUpdateProductMutation = () => {
  /* ... */
};
export const useDeleteProductMutation = () => {
  /* ... */
};
```

## 🎯 Usage Commands

```bash
# Initialize new schema
npm run codegen:init Product

# Generate code from schema
npm run codegen:api Product

# Generate from custom path
npm run codegen:api Product --from ./custom/product.yaml
```

## ⚠️ Important Notes

1. **Custom Type References**: Use format `TCurrency`, `TProduct` etc. File imports are automatically resolved.

2. **Enum Naming**: Enums are generated as `E{EntityName}{FieldName}` (e.g., `EProductCategory`).

3. **Readonly Fields**: Fields marked `readonly: true` are excluded from Create/Update types.

4. **File Naming**: Generated files follow the pattern `{EntityName}.{type}.ts`.

5. **Import Resolution**: Custom types automatically import from correct file paths.

## 🐛 Troubleshooting

**Problem**: Duplicate imports for custom types
**Solution**: The system automatically deduplicates imports using Set logic.

**Problem**: Custom type not found
**Solution**: Ensure the referenced type schema exists and has been generated first.

**Problem**: Enum not generating
**Solution**: Verify enum values are defined as array: `enum: [VALUE1, VALUE2]`

This documentation covers all supported features of the BaroPlate schema format. Each feature has been tested and verified to work with the current codegen system.
