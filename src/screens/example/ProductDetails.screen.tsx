import React, { useLayoutEffect } from "react";
import { images } from "@/assets";
import { TouchableOpacity, useWindowDimensions, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { Button, Icon, Separator, Text } from "@/components";
import { ChevronLeft, ShoppingCart } from "lucide-react-native";
import { useColors } from "@/hooks";
import { StyleSheet } from "nativewind";
import { useAppNavigation } from "@/navigators";

const AnimatedText = Animated.createAnimatedComponent(Text);

type ProductDetails = {
  id: string;
  name: string;
  brand: string;
  price: number;
  sizes: number[];
  images: number[];
  description: string;
  colors: string[];
};

const productDetails: ProductDetails = {
  id: "1",
  name: "Air Jordan 1 Retro High OG",
  brand: "Nike",
  price: 220,
  sizes: [38, 39, 40, 41, 42, 43],
  images: [
    images.product_1,
    images.product_2,
    images.product_3,
    images.product_4,
  ],
  colors: ["#FF6B6B", "#4ECDC4", "#45B29D", "#C7F46B"],
  description:
    "Một biểu tượng không thể thiếu trong thế giới sneaker, Air Jordan 1 Retro High OG không chỉ là đôi giày, mà còn là tuyên ngôn về phong cách và cá tính. Với sự kết hợp tinh tế giữa sắc trắng tinh khôi, gam đen mạnh mẽ và điểm nhấn cam rực rỡ trên swoosh, đôi giày mang lại sự cân bằng hoàn hảo giữa cổ điển và hiện đại. Thiết kế high-top giúp ôm trọn cổ chân, tạo cảm giác chắc chắn nhưng vẫn linh hoạt cho từng bước di chuyển. Chất liệu da cao cấp kết hợp cùng đường may tỉ mỉ làm nổi bật sự sang trọng và bền bỉ, trong khi phần đế cao su đặc trưng mang lại độ bám tối ưu trên nhiều bề mặt. Air Jordan 1 Retro High OG không chỉ dành cho những ai yêu thích phong cách streetwear, mà còn dễ dàng phối hợp với outfit thường ngày, biến mọi set đồ trở nên nổi bật và đậm chất cá nhân. Đây là lựa chọn hoàn hảo cho những sneakerhead muốn sở hữu một phần lịch sử huyền thoại trong bộ sưu tập của mình.",
};

export const ProductDetailsScreen = () => {
  const { width } = useWindowDimensions();
  const navigation = useAppNavigation<"ProductDetails">();
  const scrollXOffset = useSharedValue(0);
  const scrollYOffset = useSharedValue(0);

  const clampedScrollXOffset = useDerivedValue(() =>
    Math.min(
      width * (productDetails.images.length - 1),
      Math.max(0, scrollXOffset.value)
    )
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollXOffset.value = event.contentOffset.x;
    },
  });

  const scrollYHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollYOffset.value = event.contentOffset.y;
    },
  });

  const inputRange = productDetails.images.map((_, index) => index * width);
  const outputRange = productDetails.images.map(
    (_, index) => productDetails.colors[index]
  );

  const scrollViewAnimStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrollXOffset.value,
      inputRange,
      outputRange
    ),
  }));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View className="mb-safe flex-1">
      <Header
        offset={scrollYOffset}
        productName={productDetails.name}
        onBack={() => navigation.goBack()}
      />
      <Animated.ScrollView onScroll={scrollYHandler}>
        <Animated.View style={scrollViewAnimStyle}>
          <Animated.ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={scrollHandler}
          >
            {productDetails.images.map((image, index) => (
              <Item
                key={index}
                image={image}
                index={index}
                offset={scrollXOffset}
              />
            ))}
          </Animated.ScrollView>
          <Pagination
            offset={clampedScrollXOffset}
            total={productDetails.images.length}
            colors={productDetails.colors}
          />
        </Animated.View>
        <View className="flex-1">
          <View className="p-4">
            <Text>{productDetails.name}</Text>

            <Text className="text-xl font-medium text-primary">
              ${productDetails.price}
            </Text>
          </View>

          <Separator />

          <View className="p-4">
            <Text>{productDetails.description}</Text>
          </View>
        </View>
      </Animated.ScrollView>

      <View className="flex-row gap-2 px-4 pt-4">
        <Button className="flex-1" variant="outline">
          <Icon as={ShoppingCart} />
          <Text>Add to cart</Text>
        </Button>
        <Button className="flex-1">
          <Text>Buy now</Text>
        </Button>
      </View>
    </View>
  );
};

type ItemProps = {
  image: number;
  index: number;
  offset: SharedValue<number>;
};

const Item = ({ image, index, offset }: ItemProps) => {
  const { width } = useWindowDimensions();

  const animStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      offset.value / width,
      [index - 1, index, index + 1],
      [0, 1, 0]
    ),
    transform: [
      {
        scale: interpolate(
          offset.value / width,
          [index - 1, index, index + 1],
          [0.1, 1, 0.1],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return (
    <Animated.View className="aspect-square w-[100vw]" style={animStyle}>
      <Animated.Image
        key={index}
        source={image}
        resizeMode="center"
        className="h-full w-full"
      />
    </Animated.View>
  );
};

type PaginationProps = {
  total: number;
  offset: SharedValue<number>;
  colors: ProductDetails["colors"];
};

const Pagination = ({ total, offset, colors }: PaginationProps) => {
  return (
    <View className="absolute top-[100vw] z-[21] -translate-y-6 flex-row items-center justify-center gap-2 self-center rounded-full bg-foreground/20 px-2 py-1 shadow-sm">
      {Array.from({ length: total }).map((_, index) => (
        <PaginationItem
          key={index}
          offset={offset}
          index={index}
          color={colors[index]}
        />
      ))}
    </View>
  );
};

type PaginationItemProps = {
  index: number;
  offset: SharedValue<number>;
  color: string;
};

const PaginationItem = ({ index, offset, color }: PaginationItemProps) => {
  const { width } = useWindowDimensions();
  const colors = useColors();

  const animStyle = useAnimatedStyle(() => ({
    width: 12,
    height: 4,
    borderRadius: 5,
    backgroundColor: interpolateColor(
      offset.value / width,
      [index - 1, index, index + 1],
      [colors.background, color, colors.background]
    ),
  }));

  return <Animated.View style={animStyle} />;
};

type HeaderProps = {
  offset: SharedValue<number>;
  productName: string;
  onBack: () => void;
};

const Header = ({ offset, productName, onBack }: HeaderProps) => {
  const { width } = useWindowDimensions();
  const colors = useColors();

  const animStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      offset.value,
      [width * 0.2, width * 0.8],
      ["transparent", colors.background]
    ),
    borderBottomWidth: interpolate(
      offset.value,
      [width * 0.2, width * 0.8],
      [0, StyleSheet.hairlineWidth]
    ),
  }));

  const animTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(offset.value, [width * 0.2, width * 0.8], [0, 1]),
  }));
  const animButtonStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      offset.value,
      [width * 0.2, width * 0.8],
      [0.2, 1],
      Extrapolation.CLAMP
    ),
    backgroundColor: interpolateColor(
      offset.value,
      [width * 0.2, width * 0.8],
      [colors.background, colors.muted]
    ),
  }));

  return (
    <Animated.View
      className="pt-safe absolute left-0 right-0 top-0 z-[22] flex-row items-center gap-4 bg-background px-4 pb-2"
      style={animStyle}
    >
      <TouchableOpacity
        className="aspect-square rounded-full p-2"
        onPress={onBack}
      >
        <Animated.View
          style={animButtonStyle}
          className="absolute bottom-0 left-0 right-0 top-0 rounded-full bg-background"
        />
        <Icon as={ChevronLeft} size={20} />
      </TouchableOpacity>
      <AnimatedText className="font-medium" style={animTextStyle}>
        {productName}
      </AnimatedText>
    </Animated.View>
  );
};
