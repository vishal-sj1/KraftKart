import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Palette,
  Type,
  Image as ImageIcon,
  ShoppingCart,
  Download,
  Trash2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Square,
  Lock,
  Unlock,
  MoveUp,
  MoveDown,
  Circle,
  Maximize,
  Minimize,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function DesignCanvas() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedFont, setSelectedFont] = useState("Poppins");
  const [fontSize, setFontSize] = useState(20);
  const [textColor, setTextColor] = useState("#1F2937");
  const [backgroundColor, setBackgroundColor] = useState("#FAFAFA");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState("left");
  const [isLocked, setIsLocked] = useState(false);
  const [opacity, setOpacity] = useState(100);
  const [borderRadius, setBorderRadius] = useState(0);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textEffect, setTextEffect] = useState("none");
  const [shadowColor, setShadowColor] = useState("#1F2937");
  const [shadowBlur, setShadowBlur] = useState(0);
  const [shadowOffsetX, setShadowOffsetX] = useState(0);
  const [shadowOffsetY, setShadowOffsetY] = useState(0);
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [strokeColor, setStrokeColor] = useState("#1F2937");
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    console.log("DesignCanvas mounted with id:", id);
    console.log("Location state:", location.state);

    if (!canvasRef.current) {
      console.error("Canvas ref is null");
      return;
    }

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#FAFAFA",
    });
    setCanvas(fabricCanvas);

    let isMounted = true;

    const productImage =
      location.state?.productImage || "https://via.placeholder.com/400";
    console.log("Loading product image:", productImage);

    fabric.Image.fromURL(
      productImage,
      (img) => {
        if (!isMounted || !fabricCanvas) return;
        if (!img) {
          console.error("Failed to load image:", productImage);
          return;
        }
        img.scaleToWidth(400);
        fabricCanvas.centerObject(img);
        img.set({ selectable: false, evented: false });
        fabricCanvas.add(img);
        fabricCanvas.sendToBack(img);
        fabricCanvas.renderAll();
        console.log("Image added to canvas");
      },
      { crossOrigin: "anonymous" }
    );

    fabricCanvas.on("selection:created", updateSelectionState);
    fabricCanvas.on("selection:updated", updateSelectionState);
    fabricCanvas.on("selection:cleared", clearSelectionState);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      isMounted = false;
      fabricCanvas.off("selection:created", updateSelectionState);
      fabricCanvas.off("selection:updated", updateSelectionState);
      fabricCanvas.off("selection:cleared", clearSelectionState);
      document.removeEventListener("keydown", handleKeyDown);
      fabricCanvas.dispose();
      console.log("DesignCanvas unmounted");
    };
  }, [canvasRef, location.state, id]);

  const updateSelectionState = (e) => {
    const obj = e.selected[0];
    if (obj instanceof fabric.IText) {
      setTextColor(obj.get("fill"));
      setSelectedFont(obj.get("fontFamily"));
      setFontSize(obj.get("fontSize"));
      setBackgroundColor(obj.get("backgroundColor") || "#FAFAFA");
      setIsBold(obj.get("fontWeight") === "bold");
      setIsItalic(obj.get("fontStyle") === "italic");
      setIsUnderline(obj.get("underline"));
      setTextAlign(obj.get("textAlign"));
      setBorderRadius(obj.get("rx") || 0);
      setLetterSpacing(obj.get("charSpacing") || 0);
      setOpacity(Math.round(obj.opacity * 100));
      const shadow = obj.get("shadow");
      if (shadow) {
        setShadowColor(shadow.color || "#1F2937");
        setShadowBlur(shadow.blur || 0);
        setShadowOffsetX(shadow.offsetX || 0);
        setShadowOffsetY(shadow.offsetY || 0);
      } else {
        setShadowColor("#1F2937");
        setShadowBlur(0);
        setShadowOffsetX(0);
        setShadowOffsetY(0);
      }
      setStrokeWidth(obj.get("strokeWidth") || 0);
      setStrokeColor(obj.get("stroke") || "#1F2937");
      if (shadow && shadow.blur > 0) {
        setTextEffect("shadow");
      } else if (obj.get("strokeWidth") > 0) {
        setTextEffect("outline");
      } else {
        setTextEffect("none");
      }
    }
    setIsLocked(obj.lockMovementX && obj.lockMovementY);
  };

  const clearSelectionState = () => {
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setTextAlign("left");
    setFontSize(20);
    setBackgroundColor("#FAFAFA");
    setIsLocked(false);
    setOpacity(100);
    setBorderRadius(0);
    setLetterSpacing(0);
    setTextEffect("none");
    setShadowColor("#1F2937");
    setShadowBlur(0);
    setShadowOffsetX(0);
    setShadowOffsetY(0);
    setStrokeWidth(0);
    setStrokeColor("#1F2937");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Delete" && canvas) {
      const activeObjects = canvas.getActiveObjects();
      if (activeObjects.length > 0) {
        activeObjects.forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    }
  };

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.IText("Double click to edit", {
      left: 100,
      top: 100,
      fontFamily: selectedFont,
      fontSize: fontSize,
      fill: textColor,
      backgroundColor: backgroundColor,
      fontWeight: isBold ? "bold" : "normal",
      fontStyle: isItalic ? "italic" : "normal",
      underline: isUnderline,
      textAlign: textAlign,
      opacity: opacity / 100,
      rx: borderRadius,
      ry: borderRadius,
      charSpacing: letterSpacing,
      selectable: true,
      hasControls: true,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addImage = (e) => {
    if (!canvas || !e.target.files?.[0]) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target.result, (img) => {
        img.scaleToWidth(200);
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const removeSelected = () => {
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj) => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  const updateTextProperties = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "i-text") {
      activeObject.set({
        fontFamily: selectedFont,
        fontSize: fontSize,
        fill: textColor,
        backgroundColor: backgroundColor,
        fontWeight: isBold ? "bold" : "normal",
        fontStyle: isItalic ? "italic" : "normal",
        underline: isUnderline,
        textAlign: textAlign,
        opacity: opacity / 100,
        rx: borderRadius,
        ry: borderRadius,
        charSpacing: letterSpacing,
      });
      applyTextEffect(activeObject, textEffect);
      canvas.renderAll();
    }
  };

  const applyTextEffect = (textObject, effect) => {
    textObject.set({ shadow: null, stroke: null, strokeWidth: 0 });
    switch (effect) {
      case "shadow":
        textObject.set({
          shadow: new fabric.Shadow({
            color: shadowColor,
            blur: shadowBlur,
            offsetX: shadowOffsetX,
            offsetY: shadowOffsetY,
          }),
        });
        break;
      case "outline":
        textObject.set({ stroke: strokeColor, strokeWidth: strokeWidth });
        break;
      case "lift":
        textObject.set({
          shadow: new fabric.Shadow({
            color: "rgba(0,0,0,0.3)",
            blur: 4,
            offsetX: 4,
            offsetY: 4,
          }),
        });
        break;
      case "hollow":
        textObject.set({
          fill: backgroundColor || "#FAFAFA",
          stroke: textColor,
          strokeWidth: 1,
        });
        break;
      case "splice":
        textObject.set({
          stroke: "#FAFAFA",
          strokeWidth: 2,
          shadow: new fabric.Shadow({
            color: "rgba(0,0,0,0.3)",
            blur: 3,
            offsetX: 1,
            offsetY: 1,
          }),
        });
        break;
      case "echo":
        textObject.set({
          stroke: textColor,
          strokeWidth: 1,
          shadow: new fabric.Shadow({
            color: textColor,
            blur: 0,
            offsetX: 2,
            offsetY: 2,
          }),
        });
        break;
      case "glitch":
        const cyanShadow = new fabric.Shadow({
          color: "rgba(0,255,255,0.7)",
          offsetX: -2,
          offsetY: 0,
          blur: 0,
        });
        textObject._objects
          ? textObject.set({ shadow: cyanShadow })
          : textObject.set({
              stroke: "rgba(255,0,255,0.7)",
              strokeWidth: 1,
              shadow: cyanShadow,
            });
        break;
      case "neon":
        textObject.set({
          fill: "#FBBF24",
          stroke: "#FAFAFA",
          strokeWidth: 1,
          shadow: new fabric.Shadow({
            color: "#FBBF24",
            blur: 15,
            offsetX: 0,
            offsetY: 0,
          }),
        });
        break;
      default:
        break;
    }
  };

  const toggleLock = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      const newLockState = !isLocked;
      activeObject.set({
        lockMovementX: newLockState,
        lockMovementY: newLockState,
        lockRotation: newLockState,
        lockScalingX: newLockState,
        lockScalingY: newLockState,
      });
      setIsLocked(newLockState);
      canvas.renderAll();
    }
  };

  const moveLayer = (direction) => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject !== canvas.getObjects()[0]) {
      if (direction === "up") {
        canvas.bringForward(activeObject);
      } else {
        canvas.sendBackwards(activeObject);
      }
      canvas.renderAll();
    }
  };

  const updateOpacity = (value) => {
    if (!canvas) return;
    setOpacity(value);
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set("opacity", value / 100);
      canvas.renderAll();
    }
  };

  const updateFontSize = (value) => {
    if (!canvas) return;
    setFontSize(value);
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "i-text") {
      activeObject.set("fontSize", value);
      canvas.renderAll();
    }
  };

  const updateBorderRadius = (value) => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "i-text") {
      activeObject.set({ rx: value, ry: value });
      setBorderRadius(value);
      canvas.renderAll();
    }
  };

  const updateLetterSpacing = (value) => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "i-text") {
      activeObject.set({ charSpacing: value });
      setLetterSpacing(value);
      canvas.renderAll();
    }
  };

  const handleAddToBag = async () => {
    if (!canvas || !user?.userId) {
      console.error("Canvas not initialized or user not authenticated");
      alert("Please log in and ensure the canvas is loaded.");
      return;
    }

    console.log("Location state:", location.state); // Debug log to verify productId

    const fullDesignDataUrl = canvas.toDataURL({ format: "png", quality: 1 });

    // Convert data URL to a Blob
    const dataUrlToBlob = (dataUrl) => {
      const arr = dataUrl.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    };
    const fullDesignBlob = dataUrlToBlob(fullDesignDataUrl);

    const customizationDetails = {
      description,
      selectedFont,
      fontSize,
      textColor,
      backgroundColor,
      isBold,
      isItalic,
      isUnderline,
      textAlign,
      opacity,
      borderRadius,
      letterSpacing,
      textEffect,
      shadowColor,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      strokeWidth,
      strokeColor,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const formData = new FormData();
      formData.append("fullDesign", fullDesignBlob, "design.png");
      formData.append("userId", user.userId);
      formData.append("productId", location.state?.productId); // Should be an integer
      formData.append(
        "customizationDetails",
        JSON.stringify(customizationDetails)
      );
      formData.append(
        "price",
        parseFloat(location.state?.productPrice?.replace(/[^0-9.-]+/g, "") || 0)
      );

      console.log("Sending productId:", location.state?.productId); // Debug log

      const customResponse = await axios.post(
        "http://localhost:5000/api/customized-products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const customId = customResponse.data.customId;
      console.log("Customized product created with custom_id:", customId);

      const cartResponse = await axios.post(
        "http://localhost:5000/api/cart",
        {
          userId: user.userId,
          productId: location.state?.productId, // Use the same integer productId
          quantity: 1,
          size: location.state?.productSize || "N/A",
          customId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Added to cart with cartId:", cartResponse.data.cartId);

      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/cart");
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error.response?.data?.message || error.message
      );
      alert(
        `Failed to add to bag: ${
          error.response?.data?.message || "Please try again."
        }`
      );
    }
  };
  const exportCanvas = () => {
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({ format: "png", quality: 1 });
    const link = document.createElement("a");
    link.download = "design.png";
    link.href = dataUrl;
    link.click();
    console.log("Design exported:", dataUrl);
  };

  useEffect(() => {
    updateTextProperties();
  }, [
    selectedFont,
    fontSize,
    textColor,
    backgroundColor,
    isBold,
    isItalic,
    isUnderline,
    textAlign,
    opacity,
    borderRadius,
    letterSpacing,
    textEffect,
  ]);

  const fonts = [
    "Poppins",
    "Montserrat",
    "Playfair Display",
    "Roboto Mono",
    "Dancing Script",
  ];

  const textEffects = [
    { id: "none", name: "None" },
    { id: "shadow", name: "Shadow" },
    { id: "lift", name: "Lift" },
    { id: "hollow", name: "Hollow" },
    { id: "splice", name: "Splice" },
    { id: "echo", name: "Echo" },
    { id: "glitch", name: "Glitch" },
    { id: "neon", name: "Neon" },
  ];

  if (!location.state) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1F2937]">
            No Product Selected
          </h2>
          <p className="text-[#6B7280]">
            Please select a product to customize from the product page.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 px-4 py-2 bg-[#6366F1] text-[#FAFAFA] rounded-lg hover:bg-[#EDE9FE] hover:text-[#1F2937]"
          >
            Go to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="bg-[#FAFAFA] border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-[#5639be]">Design Canvas</h1>
        </div>
      </header>
      <div className="w-full mx-auto px-4 py-8 flex gap-6">
        <div className="w-[20%] bg-[#FAFAFA] p-4 rounded-lg shadow-sm border border-[#E5E7EB] max-h-[calc(100vh-120px)] overflow-y-auto">
          <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Tools</h2>
          <div className="space-y-4">
            <div>
              <label className="w-[12rem] inline-flex items-center px-4 py-2 bg-[#6366F1] text-[#FAFAFA] rounded-lg cursor-pointer hover:bg-[#EDE9FE] hover:text-[#1F2937] transition-colors">
                <ImageIcon className="w-5 h-5 mr-2" />
                Add Image
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={addImage}
                />
              </label>
            </div>
            <button
              onClick={addText}
              className="w-[12rem] inline-flex items-center px-4 py-2 bg-[#6366F1] text-[#FAFAFA] rounded-lg hover:bg-[#EDE9FE] hover:text-[#1F2937] transition-colors"
            >
              <Type className="w-5 h-5 mr-2" />
              Add Text
            </button>
            <button
              onClick={removeSelected}
              className="w-[12rem] inline-flex items-center px-4 py-2 bg-[#FBBF24] text-[#1F2937] rounded-lg hover:bg-[#EDE9FE] transition-colors"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Remove Selected
            </button>
            <div className="p-3 bg-[#F7FAFC] rounded-lg space-y-3 border border-[#E5E7EB]">
              <div className="flex gap-2">
                <button
                  onClick={toggleLock}
                  className={`p-2 rounded ${
                    isLocked ? "bg-[#EDE9FE]" : "bg-[#FAFAFA]"
                  } hover:bg-[#EDE9FE] transition-colors`}
                  title={isLocked ? "Unlock" : "Lock"}
                >
                  {isLocked ? (
                    <Lock className="w-4 h-4 text-[#6366F1]" />
                  ) : (
                    <Unlock className="w-4 h-4 text-[#6366F1]" />
                  )}
                </button>
                <button
                  onClick={() => moveLayer("up")}
                  className="p-2 rounded bg-[#FAFAFA] hover:bg-[#EDE9FE] transition-colors"
                  title="Bring Forward"
                >
                  <MoveUp className="w-4 h-4 text-[#6366F1]" />
                </button>
                <button
                  onClick={() => moveLayer("down")}
                  className="p-2 rounded bg-[#FAFAFA] hover:bg-[#EDE9FE] transition-colors"
                  title="Send Backward"
                >
                  <MoveDown className="w-4 h-4 text-[#6366F1]" />
                </button>
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-[#1F2937]">
                  <Circle className="w-4 h-4 mr-2 text-[#6366F1]" />
                  Opacity
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacity}
                  onChange={(e) => updateOpacity(parseInt(e.target.value))}
                  className="w-full accent-[#6366F1]"
                />
                <div className="text-xs text-[#6B7280] text-right">
                  {opacity}%
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1F2937]">
                  Text Size
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={fontSize}
                    onChange={(e) => updateFontSize(parseInt(e.target.value))}
                    className="flex-1 accent-[#6366F1]"
                  />
                  <div className="flex items-center gap-1 min-w-[80px]">
                    <button
                      onClick={() => updateFontSize(Math.max(10, fontSize - 5))}
                      className="p-1 rounded hover:bg-[#EDE9FE] transition-colors"
                    >
                      <span className="w-4 h-4 text-2xl text-[#6366F1]">-</span>
                    </button>
                    <span className="w-8 text-center text-[#6B7280]">
                      {fontSize}
                    </span>
                    <button
                      onClick={() =>
                        updateFontSize(Math.min(100, fontSize + 5))
                      }
                      className="p-1 rounded hover:bg-[#EDE9FE] transition-colors"
                    >
                      <span className="w-4 h-4 text-2xl text-[#6366F1]">+</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-[#F7FAFC] rounded-lg space-y-3 border border-[#E5E7EB]">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsBold(!isBold)}
                  className={`p-2 rounded ${
                    isBold ? "bg-[#EDE9FE]" : "bg-[#FAFAFA]"
                  } hover:bg-[#EDE9FE] transition-colors`}
                  title="Bold"
                >
                  <Bold className="w-4 h-4 text-[#6366F1]" />
                </button>
                <button
                  onClick={() => setIsItalic(!isItalic)}
                  className={`p-2 rounded ${
                    isItalic ? "bg-[#EDE9FE]" : "bg-[#FAFAFA]"
                  } hover:bg-[#EDE9FE] transition-colors`}
                  title="Italic"
                >
                  <Italic className="w-4 h-4 text-[#6366F1]" />
                </button>
                <button
                  onClick={() => setIsUnderline(!isUnderline)}
                  className={`p-2 rounded ${
                    isUnderline ? "bg-[#EDE9FE]" : "bg-[#FAFAFA]"
                  } hover:bg-[#EDE9FE] transition-colors`}
                  title="Underline"
                >
                  <Underline className="w-4 h-4 text-[#6366F1]" />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setTextAlign("left")}
                  className={`p-2 rounded ${
                    textAlign === "left" ? "bg-[#EDE9FE]" : "bg-[#FAFAFA]"
                  } hover:bg-[#EDE9FE] transition-colors`}
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4 text-[#6366F1]" />
                </button>
                <button
                  onClick={() => setTextAlign("center")}
                  className={`p-2 rounded ${
                    textAlign === "center" ? "bg-[#EDE9FE]" : "bg-[#FAFAFA]"
                  } hover:bg-[#EDE9FE] transition-colors`}
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4 text-[#6366F1]" />
                </button>
                <button
                  onClick={() => setTextAlign("right")}
                  className={`p-2 rounded ${
                    textAlign === "right" ? "bg-[#EDE9FE]" : "bg-[#FAFAFA]"
                  } hover:bg-[#EDE9FE] transition-colors`}
                  title="Align Right"
                >
                  <AlignRight className="w-4 h-4 text-[#6366F1]" />
                </button>
              </div>
            </div>
            <div className="p-3 bg-[#F7FAFC] rounded-lg space-y-3 border border-[#E5E7EB]">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-[#1F2937] flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-[#6366F1]" />
                  Effects
                </h3>
                <button
                  onClick={() => setShowEffectsPanel(!showEffectsPanel)}
                  className="p-1 rounded hover:bg-[#EDE9FE] transition-colors"
                >
                  {showEffectsPanel ? (
                    <Minimize className="w-4 h-4 text-[#6366F1]" />
                  ) : (
                    <Maximize className="w-4 h-4 text-[#6366F1]" />
                  )}
                </button>
              </div>
              {showEffectsPanel && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#1F2937]">
                      Roundness
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={borderRadius}
                        onChange={(e) =>
                          updateBorderRadius(parseInt(e.target.value))
                        }
                        className="flex-1 accent-[#6366F1]"
                      />
                      <div className="flex items-center gap-1 min-w-[80px]">
                        <button
                          onClick={() =>
                            updateBorderRadius(Math.max(0, borderRadius - 1))
                          }
                          className="p-1 rounded hover:bg-[#EDE9FE] transition-colors"
                        >
                          <span className="w-4 h-4 text-2xl text-[#6366F1]">
                            -
                          </span>
                        </button>
                        <span className="w-8 text-center text-[#6B7280]">
                          {borderRadius}
                        </span>
                        <button
                          onClick={() =>
                            updateBorderRadius(Math.min(20, borderRadius + 1))
                          }
                          className="p-1 rounded hover:bg-[#EDE9FE] transition-colors"
                        >
                          <span className="w-4 h-4 text-2xl text-[#6366F1]">
                            +
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#1F2937]">
                      Spread
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="-100"
                        max="800"
                        value={letterSpacing}
                        onChange={(e) =>
                          updateLetterSpacing(parseInt(e.target.value))
                        }
                        className="flex-1 accent-[#6366F1]"
                      />
                      <div className="flex items-center gap-1 min-w-[80px]">
                        <button
                          onClick={() =>
                            updateLetterSpacing(
                              Math.max(-100, letterSpacing - 10)
                            )
                          }
                          className="p-1 rounded hover:bg-[#EDE9FE] transition-colors"
                        >
                          <span className="w-4 h-4 text-2xl text-[#6366F1]">-</span>{" "}
                        </button>
                        <span className="w-8 text-center text-[#6B7280]">
                          {letterSpacing}
                        </span>
                        <button
                          onClick={() =>
                            updateLetterSpacing(
                              Math.min(800, letterSpacing + 10)
                            )
                          }
                          className="p-1 rounded hover:bg-[#EDE9FE] transition-colors"
                        >
                          <span className="w-4 h-4 text-2xl text-[#6366F1]">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#1F2937]">
                      Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-8 h-8 rounded-full overflow-hidden border border-[#E5E7EB]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#1F2937]">
                      Shape
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setTextEffect("none")}
                        className={`p-2 border rounded-lg flex flex-col items-center ${
                          textEffect === "none"
                            ? "border-[#6366F1] bg-[#EDE9FE]"
                            : "border-[#E5E7EB] bg-[#FAFAFA]"
                        } hover:bg-[#EDE9FE] transition-colors`}
                      >
                        <div className="text-xl font-bold text-[#1F2937]">
                          ABCD
                        </div>
                        <span className="text-xs mt-1 text-[#6B7280]">
                          None
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#1F2937]">
                      Style
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setTextEffect("none")}
                        className={`p-2 border rounded-lg flex flex-col items-center ${
                          textEffect === "none"
                            ? "border-[#6366F1] bg-[#EDE9FE]"
                            : "border-[#E5E7EB] bg-[#FAFAFA]"
                        } hover:bg-[#EDE9FE] transition-colors`}
                      >
                        <div className="text-xl font-bold text-[#1F2937]">
                          Ag
                        </div>
                        <span className="text-xs mt-1 text-[#6B7280]">
                          None
                        </span>
                      </button>
                      <button
                        onClick={() => setTextEffect("shadow")}
                        className={`p-2 border rounded-lg flex flex-col items-center ${
                          textEffect === "shadow"
                            ? "border-[#6366F1] bg-[#EDE9FE]"
                            : "border-[#E5E7EB] bg-[#FAFAFA]"
                        } hover:bg-[#EDE9FE] transition-colors`}
                      >
                        <div
                          className="text-xl font-bold text-[#1F2937]"
                          style={{ textShadow: "2px 2px 2px rgba(0,0,0,0.3)" }}
                        >
                          Ag
                        </div>
                        <span className="text-xs mt-1 text-[#6B7280]">
                          Shadow
                        </span>
                      </button>
                      <button
                        onClick={() => setTextEffect("lift")}
                        className={`p-2 border rounded-lg flex flex-col items-center ${
                          textEffect === "lift"
                            ? "border-[#6366F1] bg-[#EDE9FE]"
                            : "border-[#E5E7EB] bg-[#FAFAFA]"
                        } hover:bg-[#EDE9FE] transition-colors`}
                      >
                        <div
                          className="text-xl font-bold text-[#1F2937]"
                          style={{ textShadow: "3px 3px 5px rgba(0,0,0,0.4)" }}
                        >
                          Ag
                        </div>
                        <span className="text-xs mt-1 text-[#6B7280]">
                          Lift
                        </span>
                      </button>
                      <button
                        onClick={() => setTextEffect("hollow")}
                        className={`p-2 border rounded-lg flex flex-col items-center ${
                          textEffect === "hollow"
                            ? "border-[#6366F1] bg-[#EDE9FE]"
                            : "border-[#E5E7EB] bg-[#FAFAFA]"
                        } hover:bg-[#EDE9FE] transition-colors`}
                      >
                        <div
                          className="text-xl font-bold"
                          style={{
                            WebkitTextStroke: "1px #1F2937",
                            color: "#FAFAFA",
                          }}
                        >
                          Ag
                        </div>
                        <span className="text-xs mt-1 text-[#6B7280]">
                          Hollow
                        </span>
                      </button>
                      <button
                        onClick={() => setTextEffect("splice")}
                        className={`p-2 border rounded-lg flex flex-col items-center ${
                          textEffect === "splice"
                            ? "border-[#6366F1] bg-[#EDE9FE]"
                            : "border-[#E5E7EB] bg-[#FAFAFA]"
                        } hover:bg-[#EDE9FE] transition-colors`}
                      >
                        <div
                          className="text-xl font-bold text-[#1F2937]"
                          style={{
                            WebkitTextStroke: "2px #FAFAFA",
                            textShadow: "1px 1px 1px rgba(0,0,0,0.3)",
                          }}
                        >
                          Ag
                        </div>
                        <span className="text-xs mt-1 text-[#6B7280]">
                          Splice
                        </span>
                      </button>
                      <button
                        onClick={() => setTextEffect("outline")}
                        className={`p-2 border rounded-lg flex flex-col items-center ${
                          textEffect === "outline"
                            ? "border-[#6366F1] bg-[#EDE9FE]"
                            : "border-[#E5E7EB] bg-[#FAFAFA]"
                        } hover:bg-[#EDE9FE] transition-colors`}
                      >
                        <div
                          className="text-xl font-bold text-[#1F2937]"
                          style={{ WebkitTextStroke: "1px #1F2937" }}
                        >
                          Ag
                        </div>
                        <span className="text-xs mt-1 text-[#6B7280]">
                          Outline
                        </span>
                      </button>
                      <button
                        onClick={() => setTextEffect("echo")}
                        className={`p-2 border rounded-lg flex flex-col items-center ${
                          textEffect === "echo"
                            ? "border-[#6366F1] bg-[#EDE9FE]"
                            : "border-[#E5E7EB] bg-[#FAFAFA]"
                        } hover:bg-[#EDE9FE] transition-colors`}
                      >
                        <div className="text-xl font-bold relative text-[#1F2937]">
                          <span
                            style={{
                              position: "absolute",
                              left: "2px",
                              top: "2px",
                              opacity: 0.5,
                            }}
                          >
                            Ag
                          </span>
                          <span>Ag</span>
                        </div>
                        <span className="text-xs mt-1 text-[#6B7280]">
                          Echo
                        </span>
                      </button>
                      <button
                        onClick={() => setTextEffect("glitch")}
                        className={`p-2 border rounded-lg flex flex-col items-center ${
                          textEffect === "glitch"
                            ? "border-[#6366F1] bg-[#EDE9FE]"
                            : "border-[#E5E7EB] bg-[#FAFAFA]"
                        } hover:bg-[#EDE9FE] transition-colors`}
                      >
                        <div className="text-xl font-bold relative text-[#1F2937]">
                          <span
                            style={{
                              position: "absolute",
                              left: "-2px",
                              color: "#10B981",
                              opacity: 0.7,
                            }}
                          >
                            Ag
                          </span>
                          <span
                            style={{
                              position: "absolute",
                              left: "2px",
                              color: "#FBBF24",
                              opacity: 0.7,
                            }}
                          >
                            Ag
                          </span>
                          <span>Ag</span>
                        </div>
                        <span className="text-xs mt-1 text-[#6B7280]">
                          Glitch
                        </span>
                      </button>
                      <button
                        onClick={() => setTextEffect("neon")}
                        className={`p-2 border rounded-lg flex flex-col items-center ${
                          textEffect === "neon"
                            ? "border-[#6366F1] bg-[#EDE9FE]"
                            : "border-[#E5E7EB] bg-[#FAFAFA]"
                        } hover:bg-[#EDE9FE] transition-colors`}
                      >
                        <div
                          className="text-xl font-bold"
                          style={{
                            color: "#FBBF24",
                            textShadow: `0 0 5px #FBBF24, 0 0 10px #FBBF24`,
                          }}
                        >
                          Ag
                        </div>
                        <span className="text-xs mt-1 text-[#6B7280]">
                          Neon
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#1F2937]">
                Font Family
              </label>
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full rounded-md border-[#E5E7EB] shadow-sm focus:border-[#6366F1] focus:ring focus:ring-[#EDE9FE] text-[#1F2937]"
                style={{ fontFamily: selectedFont }}
              >
                {fonts.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#1F2937]">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <Square className="w-5 h-5 text-[#6366F1]" />
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full h-8 border border-[#E5E7EB] rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-[#FAFAFA] p-4 rounded-lg shadow-sm border border-[#E5E7EB]">
          <canvas ref={canvasRef} />
        </div>
        <div className="w-64 bg-[#FAFAFA] p-4 rounded-lg shadow-sm space-y-4 border border-[#E5E7EB]">
          <button
            onClick={handleAddToBag}
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-[#10B981] text-[#FAFAFA] rounded-lg hover:bg-[#EDE9FE] hover:text-[#1F2937] transition-colors"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Bag
          </button>
          <button
            onClick={exportCanvas}
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-[#6366F1] text-[#FAFAFA] rounded-lg hover:bg-[#EDE9FE] hover:text-[#1F2937] transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Export Design
          </button>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#1F2937]">
              Design Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the placement of your design..."
              className="w-full h-32 rounded-md border-[#D1D5DB] shadow-sm focus:border-[#6366F1] focus:ring focus:ring-[#EDE9FE] text-[#1F2937]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignCanvas;
