import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

const AnatomyViewer = () => {
  const canvasRef = useRef(null);
  const [selectedOrgan, setSelectedOrgan] = useState(null);

  const organs = {
    heart: {
      name: "Heart",
      description: "Muscular organ that pumps blood throughout the body",
      function: "Pumps oxygenated blood to tissues and returns deoxygenated blood to lungs",
      color: "#ef4444",
    },
    lungs: {
      name: "Lungs",
      description: "Respiratory organs responsible for gas exchange",
      function: "Facilitate oxygen intake and carbon dioxide removal",
      color: "#ec4899",
    },
    liver: {
      name: "Liver",
      description: "Largest internal organ, performs numerous metabolic functions",
      function: "Detoxification, protein synthesis, and bile production",
      color: "#8b5cf6",
    },
    stomach: {
      name: "Stomach",
      description: "Digestive organ that breaks down food",
      function: "Chemical and mechanical digestion of food",
      color: "#06b6d4",
    },
    kidneys: {
      name: "Kidneys",
      description: "Paired organs that filter blood and produce urine",
      function: "Remove waste products and regulate fluid balance",
      color: "#14b8a6",
    },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 600;

    // Draw human body outline
    ctx.fillStyle = "#e0f2fe";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw body shape
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Head
    ctx.arc(200, 70, 40, 0, Math.PI * 2);
    // Torso
    ctx.moveTo(200, 110);
    ctx.lineTo(160, 120);
    ctx.lineTo(150, 350);
    ctx.lineTo(200, 360);
    ctx.lineTo(250, 350);
    ctx.lineTo(240, 120);
    ctx.lineTo(200, 110);
    ctx.stroke();

    // Draw organs as clickable regions
    // Heart
    ctx.fillStyle = organs.heart.color;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(185, 180, 25, 0, Math.PI * 2);
    ctx.fill();

    // Lungs
    ctx.fillStyle = organs.lungs.color;
    ctx.beginPath();
    ctx.ellipse(150, 180, 20, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(220, 180, 20, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // Liver
    ctx.fillStyle = organs.liver.color;
    ctx.fillRect(160, 230, 60, 40);

    // Stomach
    ctx.fillStyle = organs.stomach.color;
    ctx.beginPath();
    ctx.ellipse(175, 280, 25, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Kidneys
    ctx.fillStyle = organs.kidneys.color;
    ctx.beginPath();
    ctx.ellipse(165, 310, 15, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(205, 310, 15, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;

    // Add click event listener
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check which organ was clicked (simplified detection)
      if (Math.sqrt(Math.pow(x - 185, 2) + Math.pow(y - 180, 2)) < 25) {
        setSelectedOrgan("heart");
      } else if (
        (Math.abs(x - 150) < 20 && Math.abs(y - 180) < 40) ||
        (Math.abs(x - 220) < 20 && Math.abs(y - 180) < 40)
      ) {
        setSelectedOrgan("lungs");
      } else if (x >= 160 && x <= 220 && y >= 230 && y <= 270) {
        setSelectedOrgan("liver");
      } else if (Math.sqrt(Math.pow(x - 175, 2) + Math.pow(y - 280, 2)) < 30) {
        setSelectedOrgan("stomach");
      } else if (
        (Math.abs(x - 165) < 15 && Math.abs(y - 310) < 25) ||
        (Math.abs(x - 205) < 15 && Math.abs(y - 310) < 25)
      ) {
        setSelectedOrgan("kidneys");
      }
    };

    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">3D Anatomy Viewer</h1>
          <p className="text-muted-foreground text-lg">
            Explore human anatomy interactively - Click on organs to learn more
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Human Body Model</CardTitle>
              <CardDescription>Click on any organ to view details</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <canvas
                ref={canvasRef}
                className="border-2 border-border rounded-lg cursor-pointer shadow-lg"
              />
            </CardContent>
          </Card>

          <div className="space-y-4">
            {selectedOrgan ? (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg"
                      style={{ backgroundColor: organs[selectedOrgan].color }}
                    />
                    <CardTitle className="text-2xl">
                      {organs[selectedOrgan].name}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {organs[selectedOrgan].description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Primary Function
                    </h4>
                    <p className="text-muted-foreground">
                      {organs[selectedOrgan].function}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    Interactive Learning Mode
                  </Badge>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-dashed">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center text-muted-foreground">
                    <Info className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Click on an organ in the model to view detailed information</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Available Organs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(organs).map(([key, organ]) => (
                    <div
                      key={key}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer smooth-transition"
                      onClick={() => setSelectedOrgan(key)}
                    >
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: organ.color }}
                      />
                      <span className="font-medium">{organ.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnatomyViewer;
