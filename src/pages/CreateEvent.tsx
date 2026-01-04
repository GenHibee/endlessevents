import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Image,
  Users,
  Ticket,
  Award,
  ArrowLeft,
  ArrowRight,
  Check,
  Globe,
  Building,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eventCategories } from "@/lib/mockData";
import { toast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

const steps = [
  { id: 1, title: "Basic Info", description: "Event details" },
  { id: 2, title: "Location", description: "Where & when" },
  { id: 3, title: "Tickets", description: "Registration settings" },
  { id: 4, title: "Review", description: "Confirm & deploy" },
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    bannerUrl: "",
    date: "",
    time: "",
    locationType: "physical" as "physical" | "virtual",
    location: "",
    maxAttendees: 100,
    registrationType: "free" as "free" | "paid" | "invite-only",
    price: 0,
    poapEnabled: true,
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleDeploy = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsDeploying(true);
    // Simulate contract deployment
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsDeploying(false);

    toast({
      title: "Event Created Successfully! 🎉",
      description: "Your Move smart contract has been deployed on Endless Protocol.",
    });

    navigate("/dashboard");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                placeholder="Web3 Developer Summit 2024"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Tell attendees what your event is about..."
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="mt-2 min-h-[120px]"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => updateField("category", value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {eventCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="banner">Banner Image URL</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="banner"
                  placeholder="https://example.com/image.jpg"
                  value={formData.bannerUrl}
                  onChange={(e) => updateField("bannerUrl", e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <Image className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: 1200x600px
              </p>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Label>Event Type</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <button
                  onClick={() => updateField("locationType", "physical")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.locationType === "physical"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Building className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-medium">Physical</p>
                  <p className="text-xs text-muted-foreground">In-person event</p>
                </button>
                <button
                  onClick={() => updateField("locationType", "virtual")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.locationType === "virtual"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Globe className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-medium">Virtual</p>
                  <p className="text-xs text-muted-foreground">Online event</p>
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="location">
                {formData.locationType === "physical" ? "Venue Address" : "Virtual Link"}
              </Label>
              <Input
                id="location"
                placeholder={
                  formData.locationType === "physical"
                    ? "123 Main St, San Francisco, CA"
                    : "https://meet.google.com/..."
                }
                value={formData.location}
                onChange={(e) => updateField("location", e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => updateField("time", e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="maxAttendees">Maximum Attendees *</Label>
              <Input
                id="maxAttendees"
                type="number"
                min={1}
                value={formData.maxAttendees}
                onChange={(e) => updateField("maxAttendees", parseInt(e.target.value))}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Registration Type</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                {[
                  { value: "free", label: "Free", desc: "No cost" },
                  { value: "paid", label: "Paid", desc: "Set a price" },
                  { value: "invite-only", label: "Invite Only", desc: "Exclusive" },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => updateField("registrationType", type.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.registrationType === type.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-medium">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {formData.registrationType === "paid" && (
              <div>
                <Label htmlFor="price">Ticket Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={formData.price}
                  onChange={(e) => updateField("price", parseFloat(e.target.value))}
                  className="mt-2"
                />
              </div>
            )}

            <div className="p-4 rounded-xl glass">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Enable POAP</p>
                    <p className="text-sm text-muted-foreground">
                      Mint proof of attendance NFTs for attendees
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.poapEnabled}
                  onCheckedChange={(checked) => updateField("poapEnabled", checked)}
                />
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-xl glass">
              <h3 className="font-display font-bold text-xl mb-4">{formData.title || "Untitled Event"}</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{formData.date || "No date set"} at {formData.time || "No time set"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{formData.location || "No location set"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{formData.maxAttendees} max attendees</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Ticket className="w-4 h-4" />
                  <span className="capitalize">{formData.registrationType} registration</span>
                  {formData.registrationType === "paid" && ` - $${formData.price}`}
                </div>
                {formData.poapEnabled && (
                  <div className="flex items-center gap-2 text-accent">
                    <Award className="w-4 h-4" />
                    <span>POAP enabled</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
              <p className="text-sm">
                <strong>What happens next:</strong> A Move smart contract will be deployed 
                on Endless Protocol to manage your event's tickets and POAPs. All 
                transactions will be gasless for your attendees.
              </p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold mb-2">
            Create <span className="text-gradient">Event</span>
          </h1>
          <p className="text-muted-foreground">
            Set up your event and deploy it on the blockchain.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-gradient-primary transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step) => (
              <div
                key={step.id}
                className="relative flex flex-col items-center"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                    step.id < currentStep
                      ? "bg-gradient-primary text-primary-foreground"
                      : step.id === currentStep
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-2 text-center hidden sm:block">
                  <p className={`text-sm font-medium ${
                    step.id <= currentStep ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 sm:p-8 rounded-2xl glass"
        >
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button variant="gradient" onClick={nextStep} className="gap-2">
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="gradient"
                onClick={handleDeploy}
                disabled={isDeploying}
                className="gap-2"
              >
                {isDeploying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Deploying Contract...
                  </>
                ) : (
                  <>
                    Deploy Event
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CreateEvent;
