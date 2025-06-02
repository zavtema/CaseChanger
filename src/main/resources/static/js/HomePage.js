document.addEventListener("DOMContentLoaded", () => {
    const typewriter = document.getElementById("typewriter");
    const reveals = document.querySelectorAll(".reveal");

    // Убираем курсор у печатающегося текста
    setTimeout(() => {
        typewriter.classList.add("finished");
    }, 1600);

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;

        reveals.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;

            if (elementTop < windowHeight - 100) {
                el.classList.add("visible");
            }
        });
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // запустить при загрузке
});
