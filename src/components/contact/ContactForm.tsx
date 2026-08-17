"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

type FormCopy = {
  kicker: string;
  headline: string;
  body: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  subjectOrder: string;
  subjectProduct: string;
  subjectReturn: string;
  subjectOther: string;
  messageLabel: string;
  messagePlaceholder: string;
  privacyNote: string;
  submit: string;
  submitting: string;
  successMessage: string;
  defaultError: string;
};

export default function ContactForm({ copy }: { copy: FormCopy }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || copy.defaultError);
      }
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "", honeypot: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : copy.defaultError);
      setStatus("error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="border border-[#1A1A1A]/10 bg-white shadow-[0_20px_60px_rgba(26,26,26,0.06)]">
        <div className="border-b border-[#1A1A1A]/10 bg-[#FAF8F6] px-6 py-5 md:px-8">
          <p className="text-xs font-sans uppercase tracking-[0.18em] text-[#8D6553] mb-2">
            {copy.kicker}
          </p>
          <h2 className="font-serif text-2xl text-[#1A1A1A]">{copy.headline}</h2>
          <p className="mt-2 text-sm font-sans text-[#1A1A1A]/60">{copy.body}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 md:px-8 md:py-8">
          <input
            type="text"
            name="honeypot"
            value={formData.honeypot}
            onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
            className="absolute -left-[9999px]"
            tabIndex={-1}
            autoComplete="off"
          />

          <div>
            <label htmlFor="name" className="block text-sm font-sans text-[#1A1A1A] mb-2">
              {copy.nameLabel} *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3.5 border border-[#1A1A1A]/20 bg-[#FFFEFD] font-sans text-[#1A1A1A] focus:outline-none focus:border-[#8D6553] transition-colors"
              placeholder={copy.namePlaceholder}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-sans text-[#1A1A1A] mb-2">
              {copy.emailLabel} *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3.5 border border-[#1A1A1A]/20 bg-[#FFFEFD] font-sans text-[#1A1A1A] focus:outline-none focus:border-[#8D6553] transition-colors"
              placeholder={copy.emailPlaceholder}
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-sans text-[#1A1A1A] mb-2">
              {copy.subjectLabel} *
            </label>
            <select
              id="subject"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3.5 border border-[#1A1A1A]/20 bg-[#FFFEFD] font-sans text-[#1A1A1A] focus:outline-none focus:border-[#8D6553] transition-colors"
            >
              <option value="">{copy.subjectPlaceholder}</option>
              <option value="order">{copy.subjectOrder}</option>
              <option value="product">{copy.subjectProduct}</option>
              <option value="return">{copy.subjectReturn}</option>
              <option value="other">{copy.subjectOther}</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-sans text-[#1A1A1A] mb-2">
              {copy.messageLabel} *
            </label>
            <textarea
              id="message"
              required
              rows={5}
              maxLength={2000}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3.5 border border-[#1A1A1A]/20 bg-[#FFFEFD] font-sans text-[#1A1A1A] focus:outline-none focus:border-[#8D6553] transition-colors resize-none"
              placeholder={copy.messagePlaceholder}
            />
          </div>

          <div className="rounded-sm border border-[#8D6553]/15 bg-[#F5F0EB] px-4 py-3">
            <p className="text-sm font-sans text-[#1A1A1A]/70">{copy.privacyNote}</p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={status === "loading"}
          >
            {status === "loading" ? copy.submitting : copy.submit}
          </Button>

          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-sm border border-green-200 bg-green-50 px-4 py-3 text-center text-green-700 font-sans"
            >
              {copy.successMessage}
            </motion.p>
          )}

          {status === "error" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-center text-red-600 font-sans"
            >
              {errorMessage || copy.defaultError}
            </motion.p>
          )}
        </form>
      </div>
    </motion.div>
  );
}
