<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Notificación de evento</title>
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
    </style>
</head>

<body>
    <div class="container">
        <div class="logo">
            <img src="{{ url('assets/logo-ts.png') }}" alt="Logo Trabajo Social">
        </div>

        <h2>Hola, {{ $nombre }}</h2>

        <p>{{ $mensaje }}</p>

        <p>Esta notificación corresponde al evento <strong>{{ $evento }}</strong>.</p>

        <div class="footer">
            © {{ date('Y') }} Trabajo Social - UMSS
        </div>
    </div>
</body>

</html>
