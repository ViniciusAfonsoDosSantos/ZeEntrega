import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);

  const adicionarAoCarrinho = (produto) => {
    setCarrinho((prev) => {
      const index = prev.findIndex(item => item.codigo === produto.codigo);
      if (index !== -1) {
        const atualizado = [...prev];
        atualizado[index].quantidade += 1;
        return atualizado;
      } else {
        return [...prev, { ...produto, quantidade: 1 }];
      }
    });
  };

  const removerDoCarrinho = (codigo) => {
    setCarrinho((prev) => {
      const index = prev.findIndex(item => item.codigo === codigo);
      if (index !== -1) {
        const atualizado = [...prev];
        if (atualizado[index].quantidade > 1) {
          atualizado[index].quantidade -= 1;
          return atualizado;
        } else {
          return atualizado.filter(item => item.codigo !== codigo);
        }
      }
      return prev;
    });
  };

  const limparCarrinho = () => setCarrinho([]);

  return (
    <CartContext.Provider value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho, limparCarrinho }}>
      {children}
    </CartContext.Provider>
  );
};
