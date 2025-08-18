import React from "react";
import { Link } from "react-router";
import "./NotFoundPage.scss";

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1>Sayfa bulunamadı</h1>
      <p>Amacın ne kardeş, yok bişi işte karıştırma!</p>
      <Link to="/">Ana Sayfaya Dön</Link>
    </div>
  );
};

export default NotFoundPage;
