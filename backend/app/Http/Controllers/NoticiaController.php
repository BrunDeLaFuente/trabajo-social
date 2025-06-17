<?php

namespace App\Http\Controllers;

use App\Models\Noticia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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
                    $path = $img->store("noticias/imagenes/{$noticia->id_noticia}/{$imagen->id_noticia_imagen}", 'public');
                    $imagen->update(['ruta_imagen_noticia' => $path]);
                }
            }

            // Videos
            if ($request->hasFile('videos')) {
                foreach ($request->file('videos') as $vid) {
                    $video = $noticia->videos()->create(['ruta_video_noticia' => '']);
                    $path = $vid->store("noticias/videos/{$noticia->id_noticia}/{$video->id_noticia_video}", 'public');
                    $video->update(['ruta_video_noticia' => $path]);
                }
            }

            // Archivos
            if ($request->hasFile('archivos')) {
                foreach ($request->file('archivos') as $file) {
                    $archivo = $noticia->archivos()->create(['ruta_archivo' => '']);
                    $path = $file->store("noticias/archivos/{$noticia->id_noticia}/{$archivo->id_noticia_archivo}", 'public');
                    $archivo->update(['ruta_archivo' => $path]);
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

            // 🔴 ELIMINAR IMÁGENES
            if ($request->has('eliminar_imagenes')) {
                foreach ($request->eliminar_imagenes as $idImg) {
                    $img = $noticia->imagenes()->find($idImg);
                    if ($img) {
                        Storage::deleteDirectory("public/noticias/imagenes/{$noticiaId}/{$img->id_noticia_imagen}");
                        $img->delete();
                    }
                }
            }

            // 🔴 ELIMINAR VIDEOS
            if ($request->has('eliminar_videos')) {
                foreach ($request->eliminar_videos as $idVid) {
                    $vid = $noticia->videos()->find($idVid);
                    if ($vid) {
                        Storage::deleteDirectory("public/noticias/videos/{$noticiaId}/{$vid->id_noticia_video}");
                        $vid->delete();
                    }
                }
            }

            // 🔴 ELIMINAR ARCHIVOS
            if ($request->has('eliminar_archivos')) {
                foreach ($request->eliminar_archivos as $idArc) {
                    $arc = $noticia->archivos()->find($idArc);
                    if ($arc) {
                        Storage::deleteDirectory("public/noticias/archivos/{$noticiaId}/{$arc->id_noticia_archivo}");
                        $arc->delete();
                    }
                }
            }

            // ✅ LIMPIAR carpetas raíz si quedaron vacías
            if ($noticia->imagenes()->count() === 0) {
                Storage::deleteDirectory("public/noticias/imagenes/{$noticiaId}");
            }

            if ($noticia->videos()->count() === 0) {
                Storage::deleteDirectory("public/noticias/videos/{$noticiaId}");
            }

            if ($noticia->archivos()->count() === 0) {
                Storage::deleteDirectory("public/noticias/archivos/{$noticiaId}");
            }

            // ✅ AÑADIR NUEVAS IMÁGENES
            if ($request->hasFile('imagenes')) {
                foreach ($request->file('imagenes') as $img) {
                    $imagen = $noticia->imagenes()->create(['ruta_imagen_noticia' => '']);
                    $path = $img->store("noticias/imagenes/{$noticiaId}/{$imagen->id_noticia_imagen}", 'public');
                    $imagen->update(['ruta_imagen_noticia' => $path]);
                }
            }

            // ✅ AÑADIR NUEVOS VIDEOS
            if ($request->hasFile('videos')) {
                foreach ($request->file('videos') as $vid) {
                    $video = $noticia->videos()->create(['ruta_video_noticia' => '']);
                    $path = $vid->store("noticias/videos/{$noticiaId}/{$video->id_noticia_video}", 'public');
                    $video->update(['ruta_video_noticia' => $path]);
                }
            }

            // ✅ AÑADIR NUEVOS ARCHIVOS
            if ($request->hasFile('archivos')) {
                foreach ($request->file('archivos') as $file) {
                    $archivo = $noticia->archivos()->create(['ruta_archivo' => '']);
                    $path = $file->store("noticias/archivos/{$noticiaId}/{$archivo->id_noticia_archivo}", 'public');
                    $archivo->update(['ruta_archivo' => $path]);
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

        $id = $noticia->id_noticia;

        // Eliminar subcarpetas de cada imagen
        foreach ($noticia->imagenes as $img) {
            Storage::deleteDirectory("public/noticias/imagenes/{$id}/{$img->id_noticia_imagen}");
        }

        // Eliminar subcarpetas de cada video
        foreach ($noticia->videos as $vid) {
            Storage::deleteDirectory("public/noticias/videos/{$id}/{$vid->id_noticia_video}");
        }

        // Eliminar subcarpetas de cada archivo
        foreach ($noticia->archivos as $file) {
            Storage::deleteDirectory("public/noticias/archivos/{$id}/{$file->id_noticia_archivo}");
        }

        // 🔥 Eliminar carpetas raíz por tipo
        Storage::deleteDirectory("public/noticias/imagenes/{$id}");
        Storage::deleteDirectory("public/noticias/videos/{$id}");
        Storage::deleteDirectory("public/noticias/archivos/{$id}");

        // Eliminar la noticia
        $noticia->delete();

        return response()->json(['message' => 'Noticia y archivos eliminados completamente']);
    }
}
