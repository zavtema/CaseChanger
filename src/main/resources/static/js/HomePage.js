document.addEventListener("DOMContentLoaded", () => {
    const typewriter = document.getElementById("typewriter");
    const reveals = document.querySelectorAll(".reveal");

    setTimeout(() => {
        typewriter.classList.add("finished");
    }, 1600);

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;

        reveals.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementBottom = el.getBoundingClientRect().bottom;

            // Если элемент полностью виден на экране
            if (elementTop < windowHeight - 100 && elementBottom > 100) {
                el.classList.add("visible");
            } else {
                el.classList.remove("visible");
            }
        });
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();
});