"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "", // Spam protection
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (formData.honeypot) {
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Der opstod en fejl ved afsendelse");
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        honeypot: "",
      });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-[#F5F0EB] py-16 md:py-20">
        <Container size="narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4">
              Kontakt Os
            </h1>
            <p className="text-[#1A1A1A]/60 font-sans">
              Vi svarer typisk inden for 24 timer
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-6">
                Kom i kontakt
              </h2>
              <p className="text-[#1A1A1A]/70 font-sans leading-relaxed mb-8">
                Har du spørgsmål om en ordre, et produkt eller noget helt tredje?
                Vi er her for at hjælpe dig.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5F0EB] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#8D6553]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">Email</h3>
                    <a href="mailto:kontakt@yunik.dk" className="text-[#8D6553] font-sans hover:underline">
                      kontakt@yunik.dk
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5F0EB] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#8D6553]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">Svartid</h3>
                    <p className="text-[#1A1A1A]/70 font-sans">
                      Vi svarer inden for 24 timer på hverdage
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5F0EB] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#8D6553]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">Adresse</h3>
                    <p className="text-[#1A1A1A]/70 font-sans">
                      Silkeborgvej 226<br />
                      8320 Åbyhøj, Danmark
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-[#F5F0EB] rounded-sm">
                <h3 className="font-serif text-lg text-[#1A1A1A] mb-2">
                  Hurtige svar
                </h3>
                <p className="text-[#1A1A1A]/70 font-sans text-sm mb-3">
                  Find måske svaret i vores FAQ
                </p>
                <a
                  href="/faq"
                  className="text-[#8D6553] font-sans text-sm hover:underline"
                >
                  Gå til FAQ →
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot - hidden from users */}
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
                    Navn *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-[#1A1A1A]/20 font-sans text-[#1A1A1A] focus:outline-none focus:border-[#8D6553] transition-colors"
                    placeholder="Dit navn"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-sans text-[#1A1A1A] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-[#1A1A1A]/20 font-sans text-[#1A1A1A] focus:outline-none focus:border-[#8D6553] transition-colors"
                    placeholder="din@email.dk"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-sans text-[#1A1A1A] mb-2">
                    Emne *
                  </label>
                  <select
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-[#1A1A1A]/20 font-sans text-[#1A1A1A] focus:outline-none focus:border-[#8D6553] transition-colors bg-white"
                  >
                    <option value="">Vælg et emne</option>
                    <option value="order">Spørgsmål om ordre</option>
                    <option value="product">Spørgsmål om produkt</option>
                    <option value="return">Returnering/bytte</option>
                    <option value="other">Andet</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-sans text-[#1A1A1A] mb-2">
                    Besked *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-[#1A1A1A]/20 font-sans text-[#1A1A1A] focus:outline-none focus:border-[#8D6553] transition-colors resize-none"
                    placeholder="Skriv din besked her..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Sender..." : "Send Besked"}
                </Button>

                {status === "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-green-600 font-sans"
                  >
                    Tak for din besked! Vi vender tilbage hurtigst muligt.
                  </motion.p>
                )}

                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-red-500 font-sans"
                  >
                    Der opstod en fejl. Prøv igen eller send en email direkte.
                  </motion.p>
                )}
              </form>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}
