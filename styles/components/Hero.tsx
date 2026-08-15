"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero">

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >

        <h1>
          Vorix Security
        </h1>

        <h2>
          امنیت دیجیتال، هوش مصنوعی و فناوری نسل جدید
        </h2>

        <p>
          طراحی سایت حرفه‌ای، توسعه نرم‌افزار، امنیت شبکه،
          دوربین مداربسته و بازیابی اطلاعات با استانداردهای جهانی
        </p>


        <div className="hero-buttons">

          <a
            href="tel:09357781529"
            className="btn-primary"
          >
            تماس فوری
          </a>


          <a
            href="https://wa.me/989357781529"
            className="btn-secondary"
          >
            واتساپ
          </a>

        </div>

      </motion.div>



      <motion.div
        className="hero-logo"
        animate={{
          y: [0, -15, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity
        }}
      >

        <img
  src="/vorix-security/logo.png
  alt="Vorix Security"
  width="300"
  height="300"
/>
        
      </motion.div>


    </section>
  );
}
