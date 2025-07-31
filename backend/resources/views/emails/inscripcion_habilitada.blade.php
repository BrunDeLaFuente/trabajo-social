<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Inscripción habilitada</title>
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

        .footer {
            margin-top: 40px;
            font-size: 0.9rem;
            color: #999;
            text-align: center;
            white-space: nowrap;
        }

        .highlight {
            background-color: #f0f8ff;
            padding: 10px;
            border-left: 4px solid #3498db;
            margin: 15px 0;
            border-radius: 4px;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="logo">
            <img src="{{ url('assets/logo-ts.png') }}" alt="Logo Trabajo Social">
        </div>

        <h2>Hola {{ $nombre }}!</h2>

        <p>🎉 Nos complace informarte que tu inscripción al evento <strong>{{ $evento }}</strong> ha sido
            <strong>habilitada</strong> exitosamente.
        </p>

        <div class="highlight">
            📅 Recuerda: el evento se llevará a cabo el
            <strong>{{ \Carbon\Carbon::parse($fecha_evento)->format('d/m/Y H:i') }}</strong>
        </div>

        <p>Por favor, llega puntual y revisa los detalles del evento en nuestra página web.</p>

        <div class="footer">
            © {{ date('Y') }} Trabajo Social - UMSS
        </div>
    </div>
</body>

</html>
