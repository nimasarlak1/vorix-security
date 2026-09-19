"use client";

import { motion } from "framer-motion";

const projects = [
  {
    title: "طراحی وب سایت شرکتی",
    text: "طراحی سایت‌های سریع، امن و مدرن برای کسب‌وکارها"
  },
  {
    title: "سیستم هوش مصنوعی",
    text: "توسعه پروژه‌های AI و راهکارهای هوشمند"
  },
  {
    title: "امنیت شبکه",
    text: "پیاده‌سازی سیستم‌های حفاظتی و امنیت دیجیتال"
  },
  {
    title: "دوربین مداربسته هوشمند",
    text: "نصب، تنظیم و بهبود تصاویر با فناوری AI"
  }
];


export default function Projects(){

  return(

    <section className="projects">

      <h2>
        نمونه کارها
      </h2>


      <div className="project-grid">

        {projects.map((project,index)=>(

          <motion.div
            key={index}
            className="project-card"
            initial={{
              opacity:0,
              scale:0.9
            }}
            whileInView={{
              opacity:1,
              scale:1
            }}
            transition={{
              duration:0.5,
              delay:index*0.1
            }}
          >

            <h3>
              {project.title}
            </h3>

            <p>
              {project.text}
            </p>

          </motion.div>

        ))}

      </div>

    </section>

  );

}
