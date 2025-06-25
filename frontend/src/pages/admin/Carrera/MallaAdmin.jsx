import { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import {
  Plus,
  Edit,
  Trash,
  X,
  Save,
  BookOpen,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Upload,
  XCircle,
  ExternalLink,
  File,
  FileIcon as FilePdf,
  ImageIcon,
  Calendar,
  GraduationCap,
  List,
  FileSpreadsheet,
} from "lucide-react";
import api from "../../../utils/api";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import CajaMensaje from "../../../components/utils/CajaMensaje";

export default function MallaAdmin() {
  const [malla, setMalla] = useState(null);
  const [originalMalla, setOriginalMalla] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'semestre', 'materia', 'contenido'
  const [selectedItem, setSelectedItem] = useState(null);
  const [parentItem, setParentItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // Estados separados para diferentes operaciones
  const [isSubmitting, setIsSubmitting] = useState(false); // Para operaciones de contenido académico
  const [isSavingFiles, setIsSavingFiles] = useState(false); // Para guardar archivos
  const [isImportingExcel, setIsImportingExcel] = useState(false); // Para importar Excel

  const [mensajes, setMensajes] = useState([]);
  const [fileChanges, setFileChanges] = useState({
    imagen: null,
    archivo_pdf: null,
    quitar_imagen: false,
    quitar_pdf: false,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const excelInputRef = useRef(null);

  // Función para agregar mensajes
  const agregarMensaje = (
    tipo,
    color,
    mensaje,
    duracion = 5000,
    backgroundColor = ""
  ) => {
    const id = Date.now();
    setMensajes((prev) => [
      ...prev,
      { id, tipo, color, mensaje, duracion, backgroundColor },
    ]);
  };

  // Función para eliminar mensajes
  const eliminarMensaje = (id) => {
    setMensajes((prev) => prev.filter((m) => m.id !== id));
  };

  // Cargar datos de la malla
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/malla");
        setMalla(response.data);
        setOriginalMalla(JSON.parse(JSON.stringify(response.data)));
        setImagePreview(response.data.imagen_url);
        setPdfPreview(response.data.archivo_pdf_url);

        // Expandir todos los semestres por defecto
        const allSemestres = new Set();
        response.data.semestres?.forEach((semestre) => {
          allSemestres.add(`semestre-${semestre.id_semestre}`);
          semestre.materias?.forEach((materia) => {
            allSemestres.add(`materia-${materia.id_materia}`);
          });
        });
        setExpandedItems(allSemestres);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        agregarMensaje(
          "fail",
          "#D32F2F",
          "Error al cargar la malla curricular."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Manejar importación de Excel
  const handleExcelImport = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Verificar que sea un archivo Excel
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (!validTypes.includes(file.type)) {
        agregarMensaje(
          "warning",
          "#ED6C02",
          "El archivo debe ser de tipo Excel (.xls, .xlsx)."
        );
        e.target.value = null;
        return;
      }

      try {
        setIsImportingExcel(true);
        agregarMensaje("info", "#2563eb", "Importando Excel...", 0, "#dbeafe");

        const formData = new FormData();
        formData.append("excel", file);

        await api.post("/malla-importar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Recargar los datos después de importar
        const response = await api.get("/malla");
        setMalla(response.data);
        setOriginalMalla(JSON.parse(JSON.stringify(response.data)));

        // Limpiar mensajes anteriores y mostrar éxito
        setMensajes([]);
        agregarMensaje(
          "success",
          "#2E7D32",
          "Archivo Excel importado correctamente."
        );
      } catch (error) {
        console.error("Error al importar el archivo:", error);
        setMensajes([]);
        agregarMensaje(
          "fail",
          "#D32F2F",
          "Error al importar el archivo Excel."
        );
      } finally {
        setIsImportingExcel(false);
        e.target.value = null;
      }
    }
  };

  // Manejar cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        agregarMensaje("warning", "#ED6C02", "El archivo debe ser una imagen.");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        agregarMensaje(
          "warning",
          "#ED6C02",
          "La imagen no debe superar los 2MB."
        );
        return;
      }

      setFileChanges({
        ...fileChanges,
        imagen: file,
        quitar_imagen: false,
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejar cambio de PDF
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (!allowedTypes.includes(file.type)) {
        agregarMensaje(
          "warning",
          "#ED6C02",
          "El archivo debe ser PDF, Word o Excel."
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        agregarMensaje(
          "warning",
          "#ED6C02",
          "El archivo no debe superar los 5MB."
        );
        return;
      }

      setFileChanges({
        ...fileChanges,
        archivo_pdf: file,
        quitar_pdf: false,
      });

      setPdfPreview(file.name);
    }
  };

  // Quitar imagen
  const handleRemoveImage = () => {
    setFileChanges({
      ...fileChanges,
      imagen: null,
      quitar_imagen: true,
    });
    setImagePreview(null);
  };

  // Quitar PDF
  const handleRemovePdf = () => {
    setFileChanges({
      ...fileChanges,
      archivo_pdf: null,
      quitar_pdf: true,
    });
    setPdfPreview(null);
  };

  // Cancelar cambios de archivos
  const handleCancelFileChanges = () => {
    setFileChanges({
      imagen: null,
      archivo_pdf: null,
      quitar_imagen: false,
      quitar_pdf: false,
    });
    setImagePreview(originalMalla?.imagen_url);
    setPdfPreview(originalMalla?.archivo_pdf_url);
  };

  // Guardar cambios de archivos
  const handleSaveFileChanges = async () => {
    try {
      setIsSavingFiles(true);

      const formDataToSend = new FormData();

      if (fileChanges.imagen) {
        formDataToSend.append("imagen", fileChanges.imagen);
      }

      if (fileChanges.archivo_pdf) {
        formDataToSend.append("archivo_pdf", fileChanges.archivo_pdf);
      }

      if (fileChanges.quitar_imagen) {
        formDataToSend.append("quitar_imagen", "1");
      }

      if (fileChanges.quitar_pdf) {
        formDataToSend.append("quitar_pdf", "1");
      }

      // Actualizar archivos
      await api.post("/mallaActualizar", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Recargar todos los datos de la malla para mantener los semestres
      const mallaResponse = await api.get("/malla");
      setMalla(mallaResponse.data);
      setOriginalMalla(JSON.parse(JSON.stringify(mallaResponse.data)));

      // Actualizar las previsualizaciones con los nuevos datos
      setImagePreview(mallaResponse.data.imagen_url);
      setPdfPreview(mallaResponse.data.archivo_pdf_url);

      // Limpiar los cambios pendientes
      setFileChanges({
        imagen: null,
        archivo_pdf: null,
        quitar_imagen: false,
        quitar_pdf: false,
      });

      // Mantener los elementos expandidos
      const allSemestres = new Set();
      mallaResponse.data.semestres?.forEach((semestre) => {
        allSemestres.add(`semestre-${semestre.id_semestre}`);
        semestre.materias?.forEach((materia) => {
          allSemestres.add(`materia-${materia.id_materia}`);
        });
      });
      setExpandedItems(allSemestres);

      agregarMensaje(
        "success",
        "#2E7D32",
        "Archivos actualizados correctamente."
      );
    } catch (error) {
      console.error("Error al guardar:", error);
      agregarMensaje("fail", "#D32F2F", "Error al actualizar los archivos.");
    } finally {
      setIsSavingFiles(false);
    }
  };

  // Toggle expandir/colapsar
  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // Verificar duplicados
  const checkDuplicates = (type, value, excludeId = null) => {
    if (type === "semestre") {
      return malla.semestres?.some(
        (semestre) =>
          semestre.numero.toLowerCase() === value.toLowerCase() &&
          semestre.id_semestre !== excludeId
      );
    } else if (type === "materia") {
      const semestre =
        parentItem ||
        malla.semestres?.find(
          (s) => s.id_semestre === selectedItem?.id_semestre
        );
      if (!semestre) return false;

      return semestre.materias?.some(
        (materia) =>
          (materia.nombre_materia.toLowerCase() ===
            value.nombre_materia.toLowerCase() ||
            materia.codigo_materia.toLowerCase() ===
              value.codigo_materia.toLowerCase()) &&
          materia.id_materia !== excludeId
      );
    } else if (type === "contenido") {
      const materia =
        parentItem ||
        malla.semestres
          ?.flatMap((s) => s.materias)
          ?.find((m) => m.id_materia === selectedItem?.id_materia);
      if (!materia) return false;

      return materia.contenidos?.some(
        (contenido) =>
          contenido.descripcion.toLowerCase() === value.toLowerCase() &&
          contenido.id_contenido !== excludeId
      );
    }
    return false;
  };

  // Abrir modal para agregar
  const openAddModal = (type, parent = null) => {
    setModalType(type);
    setSelectedItem(null);
    setParentItem(parent);
    setFormData({});
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Abrir modal para editar
  const openEditModal = (type, item) => {
    setModalType(type);
    setSelectedItem(item);
    setParentItem(null);

    if (type === "semestre") {
      setFormData({ numero: item.numero });
    } else if (type === "materia") {
      setFormData({
        nombre_materia: item.nombre_materia,
        codigo_materia: item.codigo_materia,
      });
    } else if (type === "contenido") {
      setFormData({ descripcion: item.descripcion });
    }

    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Abrir modal de eliminación
  const openDeleteModal = (type, item) => {
    setModalType(type);
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  // Cerrar modales
  const closeModals = () => {
    setIsFormModalOpen(false);
    setIsDeleteModalOpen(false);
    setModalType("");
    setSelectedItem(null);
    setParentItem(null);
    setFormData({});
    setFormErrors({});
  };

  // Manejar cambios en formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};

    if (modalType === "semestre") {
      if (!formData.numero?.trim()) {
        errors.numero = "El número de semestre es obligatorio.";
      } else if (
        checkDuplicates(
          "semestre",
          formData.numero.trim(),
          selectedItem?.id_semestre
        )
      ) {
        errors.numero = "Ya existe un semestre con este número.";
      }
    } else if (modalType === "materia") {
      if (!formData.nombre_materia?.trim()) {
        errors.nombre_materia = "El nombre de la materia es obligatorio.";
      }
      if (!formData.codigo_materia?.trim()) {
        errors.codigo_materia = "El código de la materia es obligatorio.";
      }
      if (
        formData.nombre_materia?.trim() &&
        formData.codigo_materia?.trim() &&
        checkDuplicates("materia", formData, selectedItem?.id_materia)
      ) {
        errors.nombre_materia =
          "Ya existe una materia con este nombre o código.";
        errors.codigo_materia =
          "Ya existe una materia con este nombre o código.";
      }
    } else if (modalType === "contenido") {
      if (!formData.descripcion?.trim()) {
        errors.descripcion = "La descripción del contenido es obligatoria.";
      } else if (
        checkDuplicates(
          "contenido",
          formData.descripcion.trim(),
          selectedItem?.id_contenido
        )
      ) {
        errors.descripcion = "Ya existe un contenido con esta descripción.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Guardar elemento
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      let response;

      if (selectedItem) {
        // Editar
        if (modalType === "semestre") {
          response = await api.put(
            `/semestresActualizar/${selectedItem.id_semestre}`,
            formData
          );
        } else if (modalType === "materia") {
          response = await api.put(
            `/materiasActualizar/${selectedItem.id_materia}`,
            formData
          );
        } else if (modalType === "contenido") {
          response = await api.put(
            `/contenidosActualizar/${selectedItem.id_contenido}`,
            formData
          );
        }
      } else {
        // Crear
        const dataToSend = { ...formData };

        if (modalType === "semestre") {
          dataToSend.id_malla = malla.id_malla;
          response = await api.post("/semestresCrear", dataToSend);
        } else if (modalType === "materia") {
          dataToSend.id_semestre = parentItem.id_semestre;
          response = await api.post("/materiasCrear", dataToSend);
        } else if (modalType === "contenido") {
          dataToSend.id_materia = parentItem.id_materia;
          response = await api.post("/contenidosCrear", dataToSend);
        }
      }

      // Recargar datos
      const mallaResponse = await api.get("/malla");
      setMalla(mallaResponse.data);
      setOriginalMalla(JSON.parse(JSON.stringify(mallaResponse.data)));

      agregarMensaje(
        "success",
        "#2E7D32",
        `${modalType} ${selectedItem ? "actualizado" : "creado"} correctamente.`
      );
      closeModals();
    } catch (error) {
      console.error("Error al guardar:", error);
      if (error.response?.data?.message) {
        agregarMensaje("fail", "#D32F2F", error.response.data.message);
      } else {
        agregarMensaje(
          "fail",
          "#D32F2F",
          `Error al ${selectedItem ? "actualizar" : "crear"} el ${modalType}.`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar elemento
  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      setIsSubmitting(true);

      if (modalType === "semestre") {
        await api.delete(`/semestresEliminar/${selectedItem.id_semestre}`);
      } else if (modalType === "materia") {
        await api.delete(`/materiasEliminar/${selectedItem.id_materia}`);
      } else if (modalType === "contenido") {
        await api.delete(`/contenidosEliminar/${selectedItem.id_contenido}`);
      }

      // Recargar datos
      const mallaResponse = await api.get("/malla");
      setMalla(mallaResponse.data);
      setOriginalMalla(JSON.parse(JSON.stringify(mallaResponse.data)));

      agregarMensaje(
        "success",
        "#2E7D32",
        `${modalType} eliminado correctamente.`
      );
      closeModals();
    } catch (error) {
      console.error("Error al eliminar:", error);
      agregarMensaje("fail", "#D32F2F", `Error al eliminar el ${modalType}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar árbol de contenido
  const renderTree = () => {
    if (!malla?.semestres)
      return <NoResults>No hay semestres disponibles</NoResults>;

    return malla.semestres.map((semestre) => (
      <TreeItem key={semestre.id_semestre}>
        <TreeNode level={0}>
          <TreeToggle
            onClick={() => toggleExpanded(`semestre-${semestre.id_semestre}`)}
          >
            {expandedItems.has(`semestre-${semestre.id_semestre}`) ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </TreeToggle>
          <TreeContent>
            <Calendar size={16} />
            <TreeLabel level={0}>{semestre.numero}</TreeLabel>
          </TreeContent>
          <TreeActions>
            <AddItemButton
              onClick={() => openAddModal("materia", semestre)}
              title="Agregar materia"
            >
              <Plus size={14} />
            </AddItemButton>
            <EditButton
              onClick={() => openEditModal("semestre", semestre)}
              title="Editar semestre"
            >
              <Edit size={14} />
            </EditButton>
            <DeleteButton
              onClick={() => openDeleteModal("semestre", semestre)}
              title="Eliminar semestre"
            >
              <Trash size={14} />
            </DeleteButton>
          </TreeActions>
        </TreeNode>

        {expandedItems.has(`semestre-${semestre.id_semestre}`) &&
          semestre.materias?.map((materia) => (
            <div key={materia.id_materia}>
              <TreeNode level={1}>
                <TreeToggle
                  onClick={() =>
                    toggleExpanded(`materia-${materia.id_materia}`)
                  }
                >
                  {expandedItems.has(`materia-${materia.id_materia}`) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </TreeToggle>
                <TreeContent>
                  <GraduationCap size={16} />
                  <TreeLabel level={1}>
                    {materia.nombre_materia} ({materia.codigo_materia})
                  </TreeLabel>
                </TreeContent>
                <TreeActions>
                  <AddItemButton
                    onClick={() => openAddModal("contenido", materia)}
                    title="Agregar contenido"
                  >
                    <Plus size={14} />
                  </AddItemButton>
                  <EditButton
                    onClick={() => openEditModal("materia", materia)}
                    title="Editar materia"
                  >
                    <Edit size={14} />
                  </EditButton>
                  <DeleteButton
                    onClick={() => openDeleteModal("materia", materia)}
                    title="Eliminar materia"
                  >
                    <Trash size={14} />
                  </DeleteButton>
                </TreeActions>
              </TreeNode>

              {expandedItems.has(`materia-${materia.id_materia}`) &&
                materia.contenidos?.map((contenido) => (
                  <TreeNode key={contenido.id_contenido} level={2}>
                    <div style={{ width: "1rem" }} />
                    <TreeContent>
                      <List size={16} />
                      <TreeLabel level={2}>{contenido.descripcion}</TreeLabel>
                    </TreeContent>
                    <TreeActions>
                      <EditButton
                        onClick={() => openEditModal("contenido", contenido)}
                        title="Editar contenido"
                      >
                        <Edit size={14} />
                      </EditButton>
                      <DeleteButton
                        onClick={() => openDeleteModal("contenido", contenido)}
                        title="Eliminar contenido"
                      >
                        <Trash size={14} />
                      </DeleteButton>
                    </TreeActions>
                  </TreeNode>
                ))}
            </div>
          ))}
      </TreeItem>
    ));
  };

  if (loading) {
    return <LoadingSpinner message="Cargando malla curricular..." />;
  }

  return (
    <Container2>
      <Container>
        {/* Mensajes */}
        {mensajes.map((mensaje) => (
          <CajaMensaje
            key={mensaje.id}
            tipo={mensaje.tipo}
            color={mensaje.color}
            mensaje={mensaje.mensaje}
            duracion={mensaje.duracion}
            backgroundColor={mensaje.backgroundColor}
            onClose={() => eliminarMensaje(mensaje.id)}
          />
        ))}

        <Title>
          <BookOpen size={24} /> Malla Curricular
        </Title>

        {/* Sección de archivos */}
        <Section>
          <SectionTitle>
            <File size={20} /> Archivos de la Malla
          </SectionTitle>

          <FilesGrid>
            {/* Imagen */}
            <FileCard>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Imagen de la Malla
              </h3>
              <FilePreview>
                {imagePreview && !fileChanges.quitar_imagen ? (
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Malla curricular"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <FileInfo>
                    <ImageIcon size={40} />
                    <span>Sin imagen</span>
                  </FileInfo>
                )}
              </FilePreview>
              <FileActions>
                {imagePreview && !fileChanges.quitar_imagen && (
                  <>
                    <RemoveButton onClick={handleRemoveImage}>
                      <XCircle size={16} /> Quitar
                    </RemoveButton>

                    {originalMalla?.imagen_url && (
                      <ViewButton
                        href={originalMalla.imagen_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={16} /> Ver
                      </ViewButton>
                    )}
                  </>
                )}
                <UploadButton htmlFor="imagen-upload">
                  <Upload size={16} /> {imagePreview ? "Cambiar" : "Subir"}
                  <input
                    type="file"
                    id="imagen-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={imageInputRef}
                  />
                </UploadButton>
              </FileActions>
            </FileCard>

            {/* PDF */}
            <FileCard>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Archivo PDF/Word/Excel
              </h3>
              <FilePreview>
                {pdfPreview && !fileChanges.quitar_pdf ? (
                  <FileInfo>
                    <FilePdf size={40} />
                    <span>
                      {typeof pdfPreview === "string" &&
                      pdfPreview.includes("http")
                        ? "Archivo actual"
                        : pdfPreview}
                    </span>
                  </FileInfo>
                ) : (
                  <FileInfo>
                    <File size={40} />
                    <span>Sin archivo</span>
                  </FileInfo>
                )}
              </FilePreview>
              <FileActions>
                {pdfPreview && !fileChanges.quitar_pdf && (
                  <>
                    <RemoveButton onClick={handleRemovePdf}>
                      <XCircle size={16} /> Quitar
                    </RemoveButton>
                    {originalMalla?.archivo_pdf_url && (
                      <ViewButton
                        href={originalMalla.archivo_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={16} /> Ver
                      </ViewButton>
                    )}
                  </>
                )}
                <UploadButton htmlFor="pdf-upload">
                  <Upload size={16} /> {pdfPreview ? "Cambiar" : "Subir"}
                  <input
                    type="file"
                    id="pdf-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    onChange={handlePdfChange}
                    ref={pdfInputRef}
                  />
                </UploadButton>
              </FileActions>
            </FileCard>
          </FilesGrid>

          <ActionButtons>
            <CancelButton onClick={handleCancelFileChanges}>
              <X size={16} /> Cancelar
            </CancelButton>
            <SaveButton
              onClick={handleSaveFileChanges}
              disabled={isSavingFiles}
            >
              {isSavingFiles ? (
                <>
                  <SpinIcon>⟳</SpinIcon> Guardando...
                </>
              ) : (
                <>
                  <Save size={16} /> Guardar archivos
                </>
              )}
            </SaveButton>
          </ActionButtons>
        </Section>

        {/* Sección de contenido académico */}
        <Section>
          <SectionTitle>
            <BookOpen size={20} /> Contenido Académico
          </SectionTitle>

          <TreeContainer>
            <TreeHeader>
              <ImportButton htmlFor="excel-import">
                <FileSpreadsheet size={16} /> Importar Excel
                <input
                  type="file"
                  id="excel-import"
                  accept=".xls,.xlsx"
                  onChange={handleExcelImport}
                  ref={excelInputRef}
                  disabled={isImportingExcel}
                />
              </ImportButton>

              <AddButton onClick={() => openAddModal("semestre")}>
                <Plus size={16} /> Agregar Semestre
              </AddButton>
            </TreeHeader>

            {renderTree()}
          </TreeContainer>
        </Section>

        {/* Modal de formulario */}
        {isFormModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>
                  {selectedItem ? "Editar" : "Agregar"} {modalType}
                </ModalTitle>
                <ModalCloseButton onClick={closeModals}>
                  <X size={20} />
                </ModalCloseButton>
              </ModalHeader>
              <ModalBody>
                {modalType === "semestre" && (
                  <FormGroup>
                    <Label htmlFor="numero">
                      <Calendar size={16} className="inline mr-2" /> Número de
                      semestre *
                    </Label>
                    <Input
                      type="text"
                      id="numero"
                      name="numero"
                      value={formData.numero || ""}
                      onChange={handleFormChange}
                      placeholder="Ej. Primer semestre"
                    />
                    {formErrors.numero && (
                      <ErrorMessage>{formErrors.numero}</ErrorMessage>
                    )}
                  </FormGroup>
                )}

                {modalType === "materia" && (
                  <>
                    <FormGroup>
                      <Label htmlFor="nombre_materia">
                        <GraduationCap size={16} className="inline mr-2" />{" "}
                        Nombre de la materia *
                      </Label>
                      <Input
                        type="text"
                        id="nombre_materia"
                        name="nombre_materia"
                        value={formData.nombre_materia || ""}
                        onChange={handleFormChange}
                        placeholder="Ej. Cálculo I"
                      />
                      {formErrors.nombre_materia && (
                        <ErrorMessage>{formErrors.nombre_materia}</ErrorMessage>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="codigo_materia">
                        <BookOpen size={16} className="inline mr-2" /> Código de
                        la materia *
                      </Label>
                      <Input
                        type="text"
                        id="codigo_materia"
                        name="codigo_materia"
                        value={formData.codigo_materia || ""}
                        onChange={handleFormChange}
                        placeholder="Ej. TS103"
                      />
                      {formErrors.codigo_materia && (
                        <ErrorMessage>{formErrors.codigo_materia}</ErrorMessage>
                      )}
                    </FormGroup>
                  </>
                )}

                {modalType === "contenido" && (
                  <FormGroup>
                    <Label htmlFor="descripcion">
                      <List size={16} className="inline mr-2" /> Descripción del
                      contenido *
                    </Label>
                    <TextArea
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion || ""}
                      onChange={handleFormChange}
                      placeholder="Ej. Límites y continuidad"
                    />
                    {formErrors.descripcion && (
                      <ErrorMessage>{formErrors.descripcion}</ErrorMessage>
                    )}
                  </FormGroup>
                )}
              </ModalBody>
              <ModalFooter>
                <CancelButton onClick={closeModals}>
                  <X size={16} /> Cancelar
                </CancelButton>
                <SaveButton onClick={handleSave} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <SpinIcon>⟳</SpinIcon> Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Guardar
                    </>
                  )}
                </SaveButton>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Modal de confirmación para eliminar */}
        {isDeleteModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Confirmar eliminación</ModalTitle>
                <ModalCloseButton onClick={closeModals}>
                  <X size={20} />
                </ModalCloseButton>
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle size={24} className="text-red-500" />
                  <p>¿Está seguro que desea eliminar este {modalType}?</p>
                </div>
                <p className="text-gray-500 text-sm">
                  Esta acción no se puede deshacer y eliminará todos los
                  elementos relacionados.
                </p>
              </ModalBody>
              <ModalFooter>
                <CancelButton onClick={closeModals}>
                  <X size={16} /> Cancelar
                </CancelButton>
                <Button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  style={{ backgroundColor: "#ef4444", color: "white" }}
                >
                  {isSubmitting ? (
                    <>
                      <SpinIcon>⟳</SpinIcon> Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash size={16} /> Eliminar
                    </>
                  )}
                </Button>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        )}
      </Container>
    </Container2>
  );
}

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Container2 = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.6s ease-out;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem;
    width: 100%;
    border-radius: 0;
    box-shadow: none;
    max-width: 100vw;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const FilesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FileCard = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const FilePreview = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 0.5rem;
  border: 1px dashed #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.375rem;
  }

  @media (max-width: 768px) {
    height: 150px;
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  text-align: center;
`;

const FileActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  svg {
    margin-right: 0.5rem;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }

  svg {
    margin-right: 0.5rem;
  }

  input {
    display: none;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const ImportButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: #10b981;
  color: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: #059669;
  }

  svg {
    margin-right: 0.5rem;
  }

  input {
    display: none;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const RemoveButton = styled(Button)`
  background-color: #ef4444;
  color: white;

  &:hover:not(:disabled) {
    background-color: #dc2626;
  }
`;

const ViewButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: #10b981;
  color: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;

  &:hover {
    background-color: #059669;
  }

  svg {
    margin-right: 0.5rem;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const SaveButton = styled(Button)`
  background-color: #22c55e;
  color: white;

  &:hover:not(:disabled) {
    background-color: #16a34a;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;

  &:hover:not(:disabled) {
    background-color: #e5e7eb;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const TreeContainer = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 0.75rem;
    border-radius: 0.375rem;
  }
`;

const TreeHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

const AddButton = styled(Button)`
  background-color: #3b82f6;
  color: white;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TreeItem = styled.div`
  margin-bottom: 0.5rem;
  width: 100%;
  box-sizing: border-box;
`;

const TreeNode = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: ${(props) => {
    if (props.level === 0) return "#f3f4f6";
    if (props.level === 1) return "#f9fafb";
    return "white";
  }};
  margin-left: ${(props) => props.level * 1.5}rem;
  transition: background-color 0.2s;
  width: calc(100% - ${(props) => props.level * 1.5}rem);
  box-sizing: border-box;
  min-height: 3rem;

  &:hover {
    background-color: ${(props) => {
      if (props.level === 0) return "#e5e7eb";
      if (props.level === 1) return "#f3f4f6";
      return "#f9fafb";
    }};
  }

  @media (max-width: 768px) {
    margin-left: ${(props) => props.level * 0.5}rem;
    width: calc(100% - ${(props) => props.level * 0.5}rem);
    padding: 0.5rem;
    flex-wrap: wrap;
    min-height: auto;
  }

  @media (max-width: 480px) {
    margin-left: ${(props) => props.level * 0.25}rem;
    width: calc(100% - ${(props) => props.level * 0.25}rem);
    padding: 0.5rem 0.25rem;
  }
`;

const TreeToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  margin-right: 0.5rem;
  color: #6b7280;
  transition: color 0.2s;
  flex-shrink: 0;

  &:hover {
    color: #374151;
  }

  @media (max-width: 768px) {
    margin-right: 0.25rem;
  }
`;

const TreeContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    gap: 0.25rem;
    width: 100%;
  }
`;

const TreeLabel = styled.span`
  font-weight: ${(props) =>
    props.level === 0 ? "600" : props.level === 1 ? "500" : "400"};
  color: ${(props) =>
    props.level === 0 ? "#111827" : props.level === 1 ? "#374151" : "#4b5563"};
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.3;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 0.875rem;
    line-height: 1.2;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const TreeActions = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-left: auto;
  flex-shrink: 0;

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 0.5rem;
    width: 100%;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    justify-content: center;
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    width: 1.75rem;
    height: 1.75rem;
  }

  @media (max-width: 480px) {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const EditButton = styled(IconButton)`
  background-color: #3b82f6;
  color: white;

  &:hover {
    background-color: #2563eb;
  }
`;

const DeleteButton = styled(IconButton)`
  background-color: #ef4444;
  color: white;

  &:hover {
    background-color: #dc2626;
  }
`;

const AddItemButton = styled(IconButton)`
  background-color: #10b981;
  color: white;

  &:hover {
    background-color: #059669;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  animation: ${fadeIn} 0.2s ease-in-out;
  padding: 1rem;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  animation: ${slideUp} 0.3s ease-in-out;
  display: flex;
  flex-direction: column;

  @media (max-width: 640px) {
    max-width: 100%;
    border-radius: 0.375rem;
    margin: 0 0.5rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #111827;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
`;

const SpinIcon = styled.span`
  display: inline-block;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
