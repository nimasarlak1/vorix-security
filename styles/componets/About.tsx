"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="about">

      <motion.div
        initial={{
          opacity:0,
          x:-40
        }}
        whileInView={{
          opacity:1,
          x:0
        }}
        transition={{
          duration:0.7
        }}
      >

        <h2>
          درباره Vorix Security
        </h2>

        <p>
          Vorix Security یک مجموعه فناوری محور در زمینه
          امنیت دیجیتال، هوش مصنوعی، توسعه نرم افزار،
          طراحی وب سایت‌های حرفه‌ای و راهکارهای حفاظتی است.
        </p>

        <p>
          هدف ما ارائه خدمات مدرن، سریع و امن برای کسب‌وکارها
          و سازمان‌هایی است که به فناوری قابل اعتماد نیاز دارند.
        </p>

      </motion.div>


      <motion.div
        className="stats"
        initial={{
          opacity:0,
          scale:0.8
        }}
        whileInView={{
          opacity:1,
          scale:1
        }}
      >

        <div>
          <strong>7+</strong>
          <span>خدمات تخصصی</span>
        </div>

        <div>
          <strong>24/7</strong>
          <span>پشتیبانی امنیتی</span>
        </div>

        <div>
          <strong>100%</strong>
          <span>تمرکز روی کیفیت</span>
        </div>

      </motion.div>

    </section>
  );
}
