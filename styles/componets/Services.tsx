"use client";

import { motion } from "framer-motion";

const services = [
  "طراحی و برنامه نویسی سایت‌های حرفه‌ای",
  "توسعه نرم‌افزار و پروژه‌های هوش مصنوعی",
  "نصب و مشاوره تخصصی دوربین مداربسته",
  "امنیت شبکه و سیستم‌های حفاظتی",
  "ریکاوری اطلاعات گوشی، هارد و فلش",
  "افزایش کیفیت تصاویر دوربین با هوش مصنوعی",
  "خدمات تخصصی IT و امنیت دیجیتال",
];

export default function Services() {
  return (
    <section className="services">

      <h2>
        خدمات Vorix Security
      </h2>

      <div className="service-grid">

        {services.map((item,index)=>(
          <motion.div
            key={index}
            className="service-card"
            initial={{
              opacity:0,
              y:30
            }}
            whileInView={{
              opacity:1,
              y:0
            }}
            transition={{
              duration:0.5,
              delay:index*0.1
            }}
          >

            <div className="service-icon">
              ⚡
            </div>

            <p>
              {item}
            </p>

          </motion.div>
        ))}

      </div>

    </section>
  );
}
