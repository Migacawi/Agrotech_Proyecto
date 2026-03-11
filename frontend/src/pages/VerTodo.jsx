import React, { useState } from 'react';
import Navbar from "../components/layouts/Navbar";
import Card from "../components/ui/Card";
import Categorias from "../components/layouts/categorias";
import "../styles/VerTodo.css";


function VerTodo() {

  return (
    <div className="app-container">

      <Navbar />
      
      <Categorias />
      
      </div>
    )
}

export default VerTodo;