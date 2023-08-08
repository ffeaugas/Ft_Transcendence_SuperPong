import Header from "@/components/Header";
import Register from "@/components/Register/Register";
import styles from "@/styles/page.module.css";

const page = () => {
    return (
        <section className={`${styles.page}`}>
            <Header />
            <Register />
        </section>
    );
};

export default page;
