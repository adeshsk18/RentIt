import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { Building2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import PropDetailsForm from "../components/PropDetailsForm";
import useCreateProperty from "../hooks/property/useCreateProperty";

const AddProperty = () => {
  const navigate = useNavigate();
  const { loading, createProperty } = useCreateProperty();
  const [imageFiles, setImageFiles] = useState([]);

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    title: "",
    description: "",
    rent: 1000,
    propertyType: "",
    numberOfBedrooms: 1,
    amenities: [],
    images: [],
    legalDocumentId: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reval = await createProperty(formData, imageFiles, navigate);
    if (reval) navigate("/properties");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-3xl">
        <CardHeader
          title={
            <Typography variant="h6" className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Add New Property
            </Typography>
          }
        />
        <CardContent>
          <PropDetailsForm
            formData={formData}
            setFormData={setFormData}
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            handleSubmit={handleSubmit}
            enableAF={true}
            setRemoveImages={null}
            loading={loading}
            onClose={() => navigate("/properties")}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProperty;
