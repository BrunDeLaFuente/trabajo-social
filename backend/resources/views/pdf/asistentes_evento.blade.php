<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Lista de Asistentes</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 30px;
        }

        header {
            position: relative;
            margin-bottom: 60px;
        }

        .logo-left {
            position: absolute;
            top: 0;
            left: 0;
        }

        .logo-right {
            position: absolute;
            top: 0;
            right: 0;
        }

        .logo-left img,
        .logo-right img {
            height: 80px;
            /* aumentamos el tamaño de las imágenes */
        }

        .header-text {
            text-align: center;
            margin-top: 25px;
        }

        .header-text h2 {
            margin: 3px 0;
            font-size: 14px;
            font-weight: normal;
            /* sin negrita */
        }

        h3.titulo-evento {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            /* en negrita */
            margin-top: 10px;
        }

        .fecha {
            font-size: 11px;
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            page-break-inside: auto;
        }

        thead {
            background: #f7f4f4;
        }

        thead th {
            text-align: center;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 4px 6px;
            text-align: left;
        }

        tfoot {
            page-break-after: always;
        }

        .footer {
            border-top: 1px solid #000;
            text-align: center;
            font-size: 10px;
            margin-top: 40px;
        }

        .footer .correo {
            color: blue;
        }
    </style>
</head>

<body>
    <header>
        <div class="logo-left">
            <img src="{{ public_path('assets/logo-umss.png') }}" alt="Logo UMSS">
        </div>
        <div class="logo-right">
            <img src="{{ public_path('assets/logo-ts.png') }}" alt="Logo Trabajo Social">
        </div>
        <div class="header-text">
            <h2>UNIVERSIDAD MAYOR DE SAN SIMÓN</h2>
            <h2>FACULTAD DE HUMANIDADES Y CIENCIAS DE LA EDUCACIÓN</h2>
            <h2>CARRERA DE TRABAJO SOCIAL</h2>
        </div>
    </header>

    <h3 class="titulo-evento">{{ $evento->titulo_evento }}</h3>
    <p class="fecha">Fecha: {{ \Carbon\Carbon::parse($evento->fecha_evento)->format('d/m/Y') }}</p>

    <table>
        <thead>
            <tr>
                <th>Nº</th>
                <th>NOMBRE COMPLETO</th>
                <th>NºC.I.</th>
                <th>CORREO</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($asistentes as $index => $inscripcion)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $inscripcion->asistente->nombre_asistente }}</td>
                    <td>{{ $inscripcion->asistente->ci }}</td>
                    <td>{{ $inscripcion->email_inscripcion ?? '' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Plaza Sucre, acera sud – Teléfono {{ $telefono }} <br>
        E-mail: <span class="correo"> {{ $correo }} </span> <br>
        Cochabamba - Bolivia
    </div>
</body>

</html>
