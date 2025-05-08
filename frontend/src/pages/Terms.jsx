import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const Terms = () => {
  return (
    <div className="mx-auto max-w-4xl p-4">
      <Card className="rounded-xl bg-white shadow-lg">
        <CardContent>
          <Typography variant="h4" className="mb-6 text-center font-bold">
            Terms of Service
          </Typography>

          <Typography variant="body1" className="mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="h6" className="mb-2 font-semibold">
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" className="mb-4">
            By accessing and using RentIt, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
          </Typography>

          <Typography variant="h6" className="mb-2 font-semibold">
            2. User Accounts
          </Typography>
          <Typography variant="body1" className="mb-4">
            <ul className="list-disc pl-6">
              <li>You must be at least 18 years old to create an account</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for all activities under your account</li>
            </ul>
          </Typography>

          <Typography variant="h6" className="mb-2 font-semibold">
            3. Property Listings
          </Typography>
          <Typography variant="body1" className="mb-4">
            <ul className="list-disc pl-6">
              <li>Property owners must provide accurate and truthful information</li>
              <li>Properties must comply with all local laws and regulations</li>
              <li>We reserve the right to remove listings that violate our policies</li>
              <li>Property owners are responsible for maintaining their listings</li>
            </ul>
          </Typography>

          <Typography variant="h6" className="mb-2 font-semibold">
            4. Rental Agreements
          </Typography>
          <Typography variant="body1" className="mb-4">
            <ul className="list-disc pl-6">
              <li>All rental agreements are between the property owner and tenant</li>
              <li>We are not a party to any rental agreement</li>
              <li>We do not guarantee the accuracy of property information</li>
              <li>Users are responsible for verifying all property details</li>
            </ul>
          </Typography>

          <Typography variant="h6" className="mb-2 font-semibold">
            5. Prohibited Activities
          </Typography>
          <Typography variant="body1" className="mb-4">
            Users are prohibited from:
            <ul className="list-disc pl-6">
              <li>Posting false or misleading information</li>
              <li>Harassing other users</li>
              <li>Violating any applicable laws</li>
              <li>Attempting to gain unauthorized access</li>
              <li>Using the service for illegal purposes</li>
            </ul>
          </Typography>

          <Typography variant="h6" className="mb-2 font-semibold">
            6. Limitation of Liability
          </Typography>
          <Typography variant="body1" className="mb-4">
            We are not liable for any damages arising from:
            <ul className="list-disc pl-6">
              <li>Use or inability to use our service</li>
              <li>Unauthorized access to your account</li>
              <li>Any disputes between property owners and tenants</li>
              <li>Any third-party content or services</li>
            </ul>
          </Typography>

          <Typography variant="h6" className="mb-2 font-semibold">
            7. Changes to Terms
          </Typography>
          <Typography variant="body1" className="mb-4">
            We reserve the right to modify these terms at any time. Users will be notified of significant changes. Continued use of the service after changes constitutes acceptance of the new terms.
          </Typography>

          <Typography variant="h6" className="mb-2 font-semibold">
            8. Contact Information
          </Typography>
          <Typography variant="body1" className="mb-4">
            For questions about these Terms of Service, please contact us at:
            <br />
            Email: support@rentit.com
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Terms; 