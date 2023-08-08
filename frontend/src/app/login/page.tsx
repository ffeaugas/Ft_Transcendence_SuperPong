import Header from "@/components/Header";
import Login from "@/components/login/Login";
import styles from "@/styles/page.module.css";

const page = () => {
    return (
        <section className={`${styles.page}`}>
            <Header />
            <Login />
        </section>
    );
};

export default page;
