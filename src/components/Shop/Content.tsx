import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CartoonBox from "../Common/CartoonBox";
import Image from "next/image";

// Mock dos itens da loja
const shopItemsMock = [
  {
    id: 1,
    name: "Health up",
    description: "Gives you extra HP at the start of the match",
    cost: 20,
    icon: "/assets/Shop/heart-icon.svg",
    current: 2,
    max: 3,
  },
  {
    id: 2,
    name: "Attack up",
    description: "Gives you extra attack at the start of the match",
    cost: 20,
    icon: "/assets/Shop/sword-icon.svg",
    current: 2,
    max: 3,
  },
  {
    id: 3,
    name: "Defense up",
    description: "Gives you extra defense at the start of the match",
    cost: 20,
    icon: "/assets/Shop/shield-icon.svg",
    current: 2,
    max: 3,
  },
  {
    id: 4,
    name: "Health up",
    description: "Gives you extra HP at the start of the match",
    cost: 20,
    icon: "/assets/Shop/heart-icon.svg",
    current: 2,
    max: 3,
  },
  {
    id: 5,
    name: "Attack up",
    description: "Gives you extra attack at the start of the match",
    cost: 20,
    icon: "/assets/Shop/sword-icon.svg",
    current: 2,
    max: 3,
  },
  {
    id: 6,
    name: "Defense up",
    description: "Gives you extra defense at the start of the match",
    cost: 20,
    icon: "/assets/Shop/shield-icon.svg",
    current: 2,
    max: 3,
  },
  {
    id: 7,
    name: "Health up",
    description: "Gives you extra HP at the start of the match",
    cost: 20,
    icon: "/assets/Shop/heart-icon.svg",
    current: 2,
    max: 3,
  },
  {
    id: 8,
    name: "Attack up",
    description: "Gives you extra attack at the start of the match",
    cost: 20,
    icon: "/assets/Shop/sword-icon.svg",
    current: 2,
    max: 3,
  },
  {
    id: 9,
    name: "Defense up",
    description: "Gives you extra defense at the start of the match",
    cost: 20,
    icon: "/assets/Shop/shield-icon.svg",
    current: 2,
    max: 3,
  },
];

// Variants para animação de entrada e saída
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 },
  },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  hover: { scale: 1.01, transition: { duration: 0.2 } },
};

const Content: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tableHeight, setTableHeight] = useState(0);

  // Lógica para calcular dinamicamente a altura disponível
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { height } = entries[0].contentRect;
        const availableHeight = height - 200; // Ajuste o valor conforme necessário
        setTableHeight(availableHeight);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <motion.div
      className="relative h-[calc(100vh-6rem)] bg-[#1B2F31] mx-8 my-4 border-2 border-black shadow-lg text-white overflow-hidden"
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Cabeçalho da loja */}
      <div className="sm:mb-6 p-4">
        <div className="mb-4 flex items-center gap-x-2">
          <Image src="/assets/Shop/shop-icon.svg" alt="Shop Icon" width={32} height={32} className="sm:w-12 sm:h-12" />
          <div className="flex flex-col">
            <h1 className="text-md sm:text-2xl font-semibold flex items-center gap-2">
              Shop
            </h1>
            <p className="text-xs sm:text-md text-gray-400">
              Buy Boosts from here
            </p>
          </div>
        </div>

        {/* Pontos e botão "Get more pts" */}
        <div className="flex gap-4">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="w-full cursor-pointer transition-transform"
          >
            <CartoonBox
              height={"2rem"}
              backgroundColor="#EA443B"
              borderColor="#000000"
              contentClass="flex items-center ml-4"
            >
              <Image src="/assets/Shop/coin-icon.svg" alt="Coin Icon" width={20} height={20} className="mr-1" />
              <span className="text-sm sm:text-lg font-normal">10,000pts</span>
            </CartoonBox>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="w-full max-w-[8rem] cursor-pointer transition-transform"
          >
            <CartoonBox
              height={"2rem"}
              width={"auto"}
              backgroundColor="#569CAA"
              borderColor="#000000"
              contentClass="flex items-center ml-4"
            >
              <Image src="/assets/Shop/add-icon.svg" alt="Get More Icon" width={20} height={20} className="mr-1" />
              <span className="text-sm sm:text-lg font-normal">
                Get more pts
              </span>
            </CartoonBox>
          </motion.div>
        </div>
      </div>

      {/* Lista de itens da loja */}
      <motion.div
        className="overflow-y-auto scrollable max-h-full pb-32 sm:pb-36 md:pb-40 p-4 flex flex-col space-y-6"
        variants={containerVariants}
        animate="show"
      >
        {shopItemsMock.map((item) => (
          <motion.div
            key={item.id}
            className="relative"
            variants={itemVariants}
            whileHover="hover"
          >
            <CartoonBox
              width="100%"
              height={"6rem"}
              backgroundColor="#335056"
              borderColor="#569CAA"
              className="cursor-pointer"
              contentClass="flex items-center p-4"
            >
              {/* Ícone do item à direita */}
              <Image
                src={item.icon}
                alt={`${item.name} Icon`}
                width={80}
                height={80}
                className="absolute -right-3 top-2 sm:top-1/4 transform -translate-y-1/2 w-12 h-12 sm:w-20 sm:h-20"
              />

              {/* Informações do item */}
              <div className="w-full flex flex-col">
                <span className="text-md sm:text-lg font-normal leading-none">
                  {item.name} ({item.current}/{item.max})
                </span>
                <span className="text-xs sm:text-sm text-[#FAB757] leading-none mb-2">
                  {item.description}
                </span>
                <div className="flex items-center gap-x-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    className="bg-[#569CAA] flex items-center gap-x-1 px-2 py-1 transition-transform"
                  >
                    <span className="font-light text-sm">
                      BUY ({item.cost}pts)
                    </span>
                    <Image
                      src="/assets/Shop/get-more-icon.svg"
                      alt="Get More Icon"
                      width={16}
                      height={16}
                    />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    className="bg-[#516A6F] flex items-center gap-x-1 px-2 py-1 transition-transform"
                  >
                    <span className="font-light text-sm text-gray-300">
                      You own: {item.current}/{item.max}
                    </span>
                  </motion.button>
                </div>
              </div>
            </CartoonBox>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Content;