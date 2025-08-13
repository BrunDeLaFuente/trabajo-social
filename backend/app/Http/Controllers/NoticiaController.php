<?php

namespace App\Http\Controllers;

use App\Models\Noticia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class NoticiaController extends Controller
{

    public function index()
    {
        $noticias = Noticia::with(['imagenes', 'videos', 'archivos'])
            ->get();

        $noticias->each(function ($noticia) {
            $noticia->imagenes->each->append('url');
            $noticia->videos->each->append('url');
            $noticia->archivos->each->append('url');
        });

        return response()->json($noticias);
    }

    public function indexPublic()
    {
        $noticias = Noticia::with(['imagenes', 'videos', 'archivos'])
            ->where('es_publico', '1')
            ->get();

        $noticias->each(function ($noticia) {
            $noticia->imagenes->each->append('url');
            $noticia->videos->each->append('url');
            $noticia->archivos->each->append('url');
        });

        return response()->json($noticias);
    }

    public function mostrarPorSlug($slug)
    {
        $noticia = Noticia::with(['imagenes', 'videos', 'archivos'])
            ->where('slug', $slug)
            ->where('es_publico', 1)
            ->first();

        if (!$noticia) {
            return response()->json(['message' => 'Noticia no encontrada'], 404);
        }

        // Agregar accessors a cada relación
        $noticia->imagenes->each->append('url');
        $noticia->videos->each->append('url');
        $noticia->archivos->each->append('url');

        return response()->json($noticia);
    }

    public function indexArticulos()
    {
        $articulos = Noticia::with(['imagenes', 'videos', 'archivos'])
            ->where('categoria', 'Articulo')
            ->get();

        $articulos->each(function ($noticia) {
            $noticia->imagenes->each->append('url');
            $noticia->videos->each->append('url');
            $noticia->archivos->each->append('url');
        });

        return response()->json($articulos);
    }

    public function indexComunicados()
    {
        $articulos = Noticia::with(['imagenes', 'videos', 'archivos'])
            ->where('categoria', 'Comunicado')
            ->get();

        $articulos->each(function ($noticia) {
            $noticia->imagenes->each->append('url');
            $noticia->videos->each->append('url');
            $noticia->archivos->each->append('url');
        });

        return response()->json($articulos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo_noticia' => 'required|string|max:255',
            'contenido' => 'required|string',
            'autor' => 'nullable|string',
            'categoria' => 'required|string',
            'es_publico' => 'boolean',
            'imagenes.*' => 'image|max:5120',
            'videos.*' => 'file|mimetypes:video/*|max:30720',
            'archivos.*' => 'file|max:5120',
        ]);

        DB::beginTransaction();

        try {
            // Generar slug base
            $slugBase = Str::slug($request->titulo_noticia);
            $slug = $slugBase;

            // Asegurar unicidad
            $count = 1;
            while (Noticia::where('slug', $slug)->exists()) {
                // Primero intenta reducir palabras si es posible
                $parts = explode('-', $slugBase);
                array_pop($parts);
                $shortened = implode('-', $parts);
                if (strlen($shortened) > 3 && !Noticia::where('slug', $shortened)->exists()) {
                    $slug = $shortened;
                    break;
                }
                // Si no encuentra slug único, agrega número incremental
                $slug = $slugBase . '-' . $count;
                $count++;
            }

            // Crear la noticia
            $noticia = Noticia::create([
                'titulo_noticia' => $request->titulo_noticia,
                'contenido' => $request->contenido,
                'es_publico' => $request->es_publico ?? true,
                'categoria' => $request->categoria,
                'autor' => $request->autor ?? 'Trabajo Social',
                'slug' => $slug,
            ]);

            // Imágenes
            if ($request->hasFile('imagenes')) {
                foreach ($request->file('imagenes') as $img) {
                    $imagen = $noticia->imagenes()->create(['ruta_imagen_noticia' => '']);
                    $nombre = $img->getClientOriginalName();
                    $destino = public_path("assets/noticias/imagenes/{$noticia->id_noticia}/{$imagen->id_noticia_imagen}");
                    $img->move($destino, $nombre);
                    $imagen->update(['ruta_imagen_noticia' => "noticias/imagenes/{$noticia->id_noticia}/{$imagen->id_noticia_imagen}/{$nombre}"]);
                }
            }

            // Videos
            if ($request->hasFile('videos')) {
                foreach ($request->file('videos') as $vid) {
                    $video = $noticia->videos()->create(['ruta_video_noticia' => '']);
                    $nombre = $vid->getClientOriginalName();
                    $destino = public_path("assets/noticias/videos/{$noticia->id_noticia}/{$video->id_noticia_video}");
                    $vid->move($destino, $nombre);
                    $video->update(['ruta_video_noticia' => "noticias/videos/{$noticia->id_noticia}/{$video->id_noticia_video}/{$nombre}"]);
                }
            }

            // Archivos
            if ($request->hasFile('archivos')) {
                foreach ($request->file('archivos') as $file) {
                    $archivo = $noticia->archivos()->create(['ruta_archivo' => '']);
                    $nombre = $file->getClientOriginalName();
                    $destino = public_path("assets/noticias/archivos/{$noticia->id_noticia}/{$archivo->id_noticia_archivo}");
                    $file->move($destino, $nombre);
                    $archivo->update(['ruta_archivo' => "noticias/archivos/{$noticia->id_noticia}/{$archivo->id_noticia_archivo}/{$nombre}"]);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Noticia creada correctamente']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al crear la noticia', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'titulo_noticia' => 'required|string|max:255',
            'contenido' => 'required|string',
            'autor' => 'nullable|string',
            'categoria' => 'required|string',
            'es_publico' => 'boolean',
            'imagenes.*' => 'image|max:5120',
            'videos.*' => 'file|mimetypes:video/*|max:20480',
            'archivos.*' => 'file|max:5120',
            'eliminar_imagenes' => 'array',
            'eliminar_videos' => 'array',
            'eliminar_archivos' => 'array',
        ]);

        DB::beginTransaction();

        try {
            $noticia = Noticia::with(['imagenes', 'videos', 'archivos'])->findOrFail($id);
            $noticiaId = $noticia->id_noticia;

            // ✅ Regenerar slug solo si cambió el título
            if ($request->titulo_noticia !== $noticia->titulo_noticia) {
                $slugBase = Str::slug($request->titulo_noticia);
                $slug = $slugBase;
                $count = 1;
                while (Noticia::where('slug', $slug)->where('id_noticia', '!=', $id)->exists()) {
                    $parts = explode('-', $slugBase);
                    array_pop($parts);
                    $shortened = implode('-', $parts);
                    if (strlen($shortened) > 3 && !Noticia::where('slug', $shortened)->where('id_noticia', '!=', $id)->exists()) {
                        $slug = $shortened;
                        break;
                    }
                    $slug = $slugBase . '-' . $count;
                    $count++;
                }
            } else {
                $slug = $noticia->slug;
            }

            // ✅ Actualizar noticia
            $noticia->update([
                'titulo_noticia' => $request->titulo_noticia,
                'contenido' => $request->contenido,
                'categoria' => $request->categoria,
                'es_publico' => $request->es_publico ?? true,
                'autor' => $request->autor ?? $noticia->autor,
                'slug' => $slug,
            ]);

            // Eliminar imágenes
            foreach ($request->eliminar_imagenes ?? [] as $idImg) {
                $img = $noticia->imagenes()->find($idImg);
                if ($img) {
                    $ruta = public_path('assets/' . $img->ruta_imagen_noticia);
                    if (file_exists($ruta)) unlink($ruta);
                    $directorio = dirname($ruta);
                    if (is_dir($directorio)) @rmdir($directorio); // eliminar carpeta si queda vacía
                    $img->delete();
                }
            }

            // Eliminar videos
            foreach ($request->eliminar_videos ?? [] as $idVid) {
                $vid = $noticia->videos()->find($idVid);
                if ($vid) {
                    $ruta = public_path('assets/' . $vid->ruta_video_noticia);
                    if (file_exists($ruta)) unlink($ruta);
                    $directorio = dirname($ruta);
                    if (is_dir($directorio)) @rmdir($directorio);
                    $vid->delete();
                }
            }

            // Eliminar archivos
            foreach ($request->eliminar_archivos ?? [] as $idArc) {
                $arc = $noticia->archivos()->find($idArc);
                if ($arc) {
                    $ruta = public_path('assets/' . $arc->ruta_archivo);
                    if (file_exists($ruta)) unlink($ruta);
                    $directorio = dirname($ruta);
                    if (is_dir($directorio)) @rmdir($directorio);
                    $arc->delete();
                }
            }

            // ✅ LIMPIAR carpetas raíz si quedaron vacías
            $imagenesDir = public_path("assets/noticias/imagenes/{$noticiaId}");
            $videosDir = public_path("assets/noticias/videos/{$noticiaId}");
            $archivosDir = public_path("assets/noticias/archivos/{$noticiaId}");

            if ($noticia->imagenes()->count() === 0 && is_dir($imagenesDir)) {
                @rmdir($imagenesDir);
            }
            if ($noticia->videos()->count() === 0 && is_dir($videosDir)) {
                @rmdir($videosDir);
            }
            if ($noticia->archivos()->count() === 0 && is_dir($archivosDir)) {
                @rmdir($archivosDir);
            }

            // Agregar nuevas imágenes
            if ($request->hasFile('imagenes')) {
                foreach ($request->file('imagenes') as $img) {
                    $imagen = $noticia->imagenes()->create(['ruta_imagen_noticia' => '']);
                    $nombre = $img->getClientOriginalName();
                    $destino = public_path("assets/noticias/imagenes/{$noticiaId}/{$imagen->id_noticia_imagen}");
                    $img->move($destino, $nombre);
                    $imagen->update(['ruta_imagen_noticia' => "noticias/imagenes/{$noticiaId}/{$imagen->id_noticia_imagen}/{$nombre}"]);
                }
            }

            // Agregar nuevos videos
            if ($request->hasFile('videos')) {
                foreach ($request->file('videos') as $vid) {
                    $video = $noticia->videos()->create(['ruta_video_noticia' => '']);
                    $nombre = $vid->getClientOriginalName();
                    $destino = public_path("assets/noticias/videos/{$noticiaId}/{$video->id_noticia_video}");
                    $vid->move($destino, $nombre);
                    $video->update(['ruta_video_noticia' => "noticias/videos/{$noticiaId}/{$video->id_noticia_video}/{$nombre}"]);
                }
            }

            // Agregar nuevos archivos
            if ($request->hasFile('archivos')) {
                foreach ($request->file('archivos') as $file) {
                    $archivo = $noticia->archivos()->create(['ruta_archivo' => '']);
                    $nombre = $file->getClientOriginalName();
                    $destino = public_path("assets/noticias/archivos/{$noticiaId}/{$archivo->id_noticia_archivo}");
                    $file->move($destino, $nombre);
                    $archivo->update(['ruta_archivo' => "noticias/archivos/{$noticiaId}/{$archivo->id_noticia_archivo}/{$nombre}"]);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Noticia actualizada correctamente']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al actualizar', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $noticia = Noticia::with(['imagenes', 'videos', 'archivos'])->findOrFail($id);
        $idNoticia = $noticia->id_noticia;

        // 🔴 Eliminar subcarpetas y archivos de IMÁGENES
        foreach ($noticia->imagenes as $img) {
            $dir = public_path("assets/noticias/imagenes/{$idNoticia}/{$img->id_noticia_imagen}");
            if (is_dir($dir)) {
                foreach (glob("$dir/*") as $file) {
                    @unlink($file);
                }
                @rmdir($dir);
            }
        }

        // 🔴 Eliminar subcarpetas y archivos de VIDEOS
        foreach ($noticia->videos as $vid) {
            $dir = public_path("assets/noticias/videos/{$idNoticia}/{$vid->id_noticia_video}");
            if (is_dir($dir)) {
                foreach (glob("$dir/*") as $file) {
                    @unlink($file);
                }
                @rmdir($dir);
            }
        }

        // 🔴 Eliminar subcarpetas y archivos de ARCHIVOS
        foreach ($noticia->archivos as $arc) {
            $dir = public_path("assets/noticias/archivos/{$idNoticia}/{$arc->id_noticia_archivo}");
            if (is_dir($dir)) {
                foreach (glob("$dir/*") as $file) {
                    @unlink($file);
                }
                @rmdir($dir);
            }
        }

        // 🔥 Eliminar carpetas raíz si quedaron vacías
        @rmdir(public_path("assets/noticias/imagenes/{$idNoticia}"));
        @rmdir(public_path("assets/noticias/videos/{$idNoticia}"));
        @rmdir(public_path("assets/noticias/archivos/{$idNoticia}"));

        // Eliminar la noticia
        $noticia->delete();

        return response()->json(['message' => 'Noticia y archivos eliminados completamente']);
    }

    public function descargarArchivo($tipo, $id)
    {
        try {
            switch ($tipo) {
                case 'imagen':
                    $archivo = DB::table('noticia_imagen')->where('id_noticia_imagen', $id)->first();
                    $ruta = $archivo->ruta_imagen_noticia ?? null;
                    break;

                case 'video':
                    $archivo = DB::table('noticia_video')->where('id_noticia_video', $id)->first();
                    $ruta = $archivo->ruta_video_noticia ?? null;
                    break;

                case 'archivo':
                    $archivo = DB::table('noticia_archivo')->where('id_noticia_archivo', $id)->first();
                    $ruta = $archivo->ruta_archivo ?? null;
                    break;

                default:
                    return response()->json(['error' => 'Tipo de archivo no válido.'], 400);
            }

            if (!$archivo || !$ruta) {
                return response()->json(['error' => 'Archivo no encontrado.'], 404);
            }

            $rutaAbsoluta = public_path('assets/' . $ruta);

            if (!file_exists($rutaAbsoluta)) {
                return response()->json(['error' => 'Archivo no encontrado en servidor.'], 404);
            }

            return response()->file($rutaAbsoluta);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al descargar el archivo.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
