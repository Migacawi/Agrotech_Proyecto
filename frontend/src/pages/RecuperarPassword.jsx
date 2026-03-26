import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  solicitarCodigoRecuperacion,
  verificarCodigoRecuperacion,
  cambiarPassword,
} from '../api/authService';
import "../styles/Login.css";
import Swal from 'sweetalert2';

function RecuperarPassword() {
  const [paso, setPaso]             = useState(1); // 1=email, 2=código, 3=nueva contraseña
  const [email, setEmail]           = useState('');
  const [codigo, setCodigo]         = useState('');
  const [nuevaPass, setNuevaPass]   = useState('');
  const [confirmaPass, setConfirmaPass] = useState('');
  const [loading, setLoading]       = useState(false);
  const navigate                    = useNavigate();

  const imagenFondo = "/fondo_proyecto.jpg";
  const imagenLogo  = "/logo.png";

  // ── Paso 1: enviar código ──────────────────────────────────────────────────
  const handleEnviarCodigo = async () => {
    if (!email.trim())
      return Swal.fire({ icon: 'warning', title: 'Ingresa tu correo', confirmButtonColor: '#07393c' });

    setLoading(true);
    try {
      await solicitarCodigoRecuperacion(email.trim());
      Swal.fire({
        icon: 'success',
        title: '¡Código enviado!',
        text: 'Revisa tu correo. El código expira en 15 minutos.',
        confirmButtonColor: '#07393c',
      });
      setPaso(2);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || err.message || 'No se pudo enviar el código',
        confirmButtonColor: '#07393c',
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Paso 2: verificar código ───────────────────────────────────────────────
  const handleVerificarCodigo = async () => {
    if (codigo.trim().length !== 6)
      return Swal.fire({ icon: 'warning', title: 'El código debe tener 6 dígitos', confirmButtonColor: '#07393c' });

    setLoading(true);
    try {
      await verificarCodigoRecuperacion(email.trim(), codigo.trim());
      setPaso(3);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Código inválido',
        text: err.response?.data?.message || 'El código es incorrecto o expiró',
        confirmButtonColor: '#07393c',
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Paso 3: cambiar contraseña ─────────────────────────────────────────────
  const handleCambiarPassword = async () => {
    if (nuevaPass.length < 6)
      return Swal.fire({ icon: 'warning', title: 'La contraseña debe tener al menos 6 caracteres', confirmButtonColor: '#07393c' });
    if (nuevaPass !== confirmaPass)
      return Swal.fire({ icon: 'warning', title: 'Las contraseñas no coinciden', confirmButtonColor: '#07393c' });

    setLoading(true);
    try {
      await cambiarPassword(email.trim(), codigo.trim(), nuevaPass);
      await Swal.fire({
        icon: 'success',
        title: '¡Contraseña actualizada!',
        text: 'Ya puedes iniciar sesión con tu nueva contraseña.',
        confirmButtonColor: '#07393c',
      });
      navigate('/login');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'No se pudo cambiar la contraseña',
        confirmButtonColor: '#07393c',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <img src={imagenFondo} alt="Agrotech Background" className="main-bg-img" />
      </div>

      <div className="right-panel">
        <div className="header">
          <img src={imagenLogo} alt="Agrotech Logo" className="logo-img" />
        </div>

        <div className="content">

          {/* ── PASO 1: correo ── */}
          {paso === 1 && (
            <>
              <h1 className="welcome-title">Recuperar contraseña</h1>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                Ingresa tu correo y te enviaremos un código de verificación.
              </p>
              <div className="input-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@gmail.com"
                  onKeyDown={(e) => e.key === 'Enter' && handleEnviarCodigo()}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                />
              </div>
              <button className="login-button" onClick={handleEnviarCodigo} disabled={loading}>
                {loading ? 'Enviando…' : 'Enviar código'}
              </button>
            </>
          )}

          {/* ── PASO 2: código ── */}
          {paso === 2 && (
            <>
              <h1 className="welcome-title">Verifica tu código</h1>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                Ingresa el código de 6 dígitos que enviamos a <strong>{email}</strong>.
              </p>
              <div className="input-group">
                <label>Código de verificación</label>
                <input
                  type="text"
                  maxLength={6}
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  onKeyDown={(e) => e.key === 'Enter' && handleVerificarCodigo()}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '24px', letterSpacing: '8px', textAlign: 'center' }}
                />
              </div>
              <button className="login-button" onClick={handleVerificarCodigo} disabled={loading}>
                {loading ? 'Verificando…' : 'Verificar código'}
              </button>
              <button
                onClick={() => handleEnviarCodigo()}
                disabled={loading}
                style={{ background: 'none', border: 'none', color: '#07393c', cursor: 'pointer', fontSize: '13px', marginTop: '10px', textDecoration: 'underline' }}
              >
                Reenviar código
              </button>
            </>
          )}

          {/* ── PASO 3: nueva contraseña ── */}
          {paso === 3 && (
            <>
              <h1 className="welcome-title">Nueva contraseña</h1>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                Elige una contraseña segura de al menos 6 caracteres.
              </p>
              <div className="input-group">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  value={nuevaPass}
                  onChange={(e) => setNuevaPass(e.target.value)}
                  placeholder="Nueva contraseña"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                />
              </div>
              <div className="input-group" style={{ marginTop: '12px' }}>
                <label>Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirmaPass}
                  onChange={(e) => setConfirmaPass(e.target.value)}
                  placeholder="Repite la contraseña"
                  onKeyDown={(e) => e.key === 'Enter' && handleCambiarPassword()}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                />
              </div>
              <button className="login-button" onClick={handleCambiarPassword} disabled={loading} style={{ marginTop: '16px' }}>
                {loading ? 'Guardando…' : 'Guardar contraseña'}
              </button>
            </>
          )}

          <div className="footer" style={{ marginTop: '20px' }}>
            <Link to="/login" className="create-account">← Volver al inicio de sesión</Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RecuperarPassword;