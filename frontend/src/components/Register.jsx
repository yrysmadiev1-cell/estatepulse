import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { registerUser } from "../utils/api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { token, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const isAdmin = user?.role === "admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await registerUser({ name, email, password }, token);
      setSuccess(`Пользователь ${email} создан`);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <SiteHeader actionLabel="На главную" actionTo="/" />
      <main className="container narrow">
        <section className="form-panel glass-panel">
          <p className="eyebrow">Создаём доступ</p>
          <h1 className="post-title">Регистрация</h1>
          {isAdmin ? (
            <p className="form-lead">Доступно только администраторам. Создайте учетную запись для коллеги, чтобы он мог авторизоваться.</p>
          ) : (
            <p className="form-lead">
              Регистрация недоступна. Пожалуйста, обратитесь к администратору или <Link to="/login">войдите</Link> под админ-аккаунтом.
            </p>
          )}

          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="register-name">Имя</label>
              <input
                id="register-name"
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-email">Email</label>
              <input
                id="register-email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Пароль</label>
              <input
                id="register-password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>

            {error && <p className="form-error">{error}</p>}
            {success && <p className="success-note">{success}</p>}

            <button type="submit" className="btn btn-primary" disabled={loading || !isAdmin}>
              {loading ? "Создаём аккаунт..." : "Зарегистрировать пользователя"}
            </button>
          </form>

          <p className="hero-description">
            Уже есть доступ? <Link to="/login">Войдите</Link>.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default Register;
