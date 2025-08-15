<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Credenciales de acceso</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 2rem;
            color: #333;
        }

        .container {
            background-color: white;
            padding: 2rem;
            border-radius: 8px;
            border: 1px solid #ccc;
        }

        .logo {
            text-align: center;
            margin-bottom: 20px;
        }

        .logo img {
            height: 80px;
        }

        @media (min-width: 768px) {
            .logo img {
                height: 120px;
            }
        }

        .button {
            background-color: #2d3748;
            /* Color similar al de la imagen */
            color: white !important;
            /* Asegura texto blanco incluso si es un enlace */
            padding: 10px 20px;
            text-decoration: none !important;
            /* Elimina subrayado */
            display: inline-block;
            margin-top: 20px;
            border-radius: 5px;
            font-weight: bold;
            border: none;
        }

        .footer {
            margin-top: 40px;
            font-size: 0.9rem;
            color: #999;
            text-align: center;
            white-space: nowrap;
            /* evita que el texto se parta */
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="logo">
            <img src="{{ url('assets/logo-ts.png') }}" alt="Logo Trabajo Social">
        </div>

        <h2>Hola, {{ $nombre }}</h2>

        <p>Has sido registrado como <strong>{{ $rol ? 'Administrador' : 'Colaborador' }}</strong> en el sistema web de
            Trabajo Social.</p>

        <p>
            <strong>Correo:</strong> {{ $correo }}<br>
            <strong>Contraseña:</strong> {{ $password }}
        </p>

        <p>Puedes iniciar sesión usando el siguiente botón:</p>

        <div style="text-align: center;">
            <a href="{{ $loginUrl }}" class="button">Iniciar sesión</a>
        </div>

        <div class="footer">
            © {{ date('Y') }} Trabajo Social - UMSS
        </div>
    </div>
</body>

</html>
