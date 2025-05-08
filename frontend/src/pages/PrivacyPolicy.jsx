import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <div className="mx-auto max-w-4xl p-4">
      <Card className="rounded-xl bg-white shadow-lg">
        <CardContent>
          <Typography variant="h4" className="mb-6 text-center font-bold">
            Privacy Policy
          </Typography>

          <Typography variant="body1" className="mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="h6" className="mb-2 font-semibold">
            1. Information We Collect
          </Typography>
          <Typography variant="body1" className="mb-4">
            We collect information that you provide directly to us, including:
            <ul className="list-disc pl-6">
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Property information (for owners)</li>
              <li>Payment information</li>
              <li>Communication preferences</li>
            </ul>
          </Typography>

          <Typography variant="h6" className="mb-2 font-semibold">
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" className="mb-4">
            We use the collected information to:
            <ul className="list-disc pl-6">
              <li>Provide and maintain our services</li>
              <li>Process transactions</li>
              <li>Send notifications and updates</li>
              <li>Improve our services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </Typography>

          <Typography variant="h6" className="mb-2 font-semibold">
            3. Information Sharing
          </Typography>
          <Typography variant="body1" className="mb-4">
            We do not sell your personal information. We may share your information with:
            <ul className="list-disc pl-6">
              <li>Service providers who assist in our operations</li>
              <li>Legal authorities when required by law</li>
              <li>Other users as necessary for the service (e.g., property owners and tenants)</li>
            </ul>
          </Typography>

          <Typography variant="h6" className="mb-2 font-semibold">
            4. Data Security
          </Typography>
          <Typography variant="body1" className="mb-4">
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
          </Typography>

          <Typography variant="h6" className="mb-2 font-semibold">
            5. Your Rights
          </Typography>
          <Typography variant="body1" className="mb-4">
            You have the right to:
            <ul className="list-disc pl-6">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </Typography>

          <Typography variant="h6" className="mb-2 font-semibold">
            6. Contact Us
          </Typography>
          <Typography variant="body1" className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            Email: support@rentit.com
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy; 