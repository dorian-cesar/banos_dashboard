axios.get(config.urlBase + "verSession.php").then(response => {
    const tema = response.data.tema_nombre || "light";
    console.log("Tema recibido desde sesión:", tema);
    console.log("Session actual:", response.data.rol);

    applyTheme(tema);
})

    .catch(error => {
        console.error("Error al obtener sesión:", error);
    });

function applyTheme(nombreTema) {
    const clase = nombreTema.endsWith("-theme") ? nombreTema : nombreTema + "-theme";
    document.body.classList.remove("light-theme", "dark-theme", "blue-theme", "green-theme", "preload-theme");
    document.body.classList.add(clase);
}

function toggleSidebar() {
    let body = document.body;
    let sidebar = document.getElementById("sidebar");

    if (body.classList.contains("sidebar-open")) {
        body.classList.remove("sidebar-open");
        sidebar.style.left = "-250px";
    } else {
        body.classList.add("sidebar-open");
        sidebar.style.left = "0px";
    }
}


const blocked = ["https://wit.la"];
async function loadPage(page) {
    const iframe = document.getElementById('external-content');
    const localContent = document.getElementById('local-content');

    // LOCAL
    if (!/^(https?:)?\/\//.test(page)) {
        iframe.style.display = 'none';
        localContent.style.display = 'block';
        $("#local-content").load("pages/" + page, function() {
            if (page === "users.html") loadUsers();
        });
        return;
    }

    // EXTERNA
    iframe.style.display = 'block';
    localContent.style.display = 'none';

    if (blocked.some(domain => page.startsWith(domain))) {
        console.warn("Redirigiendo...");
        window.location.href = page;
        return;
    }

    // Intentar cargar en iframe
    iframe.style.display = 'block';
    localContent.style.display = 'none';
    iframe.src = page;
}





function logout() {
    axios.post(config.urlBase + "logout.php", {}, { withCredentials: true })
        .then(() => {
            window.location.href = "pages/login.html";
        });
}


$(document).ready(function () {
    axios.get(config.urlBase + "check_session.php", { withCredentials: true })
        .then(response => {
            if (!response.data.loggedIn) {
                window.location.href = "pages/login.html"; // Redirige si no hay sesión
            } else {
                let rol_id = response.data.rol_id;
                let empresa = response.data.empresa || "Sin empresa asignada";
                $("#empresas").text(empresa);

            }
        });

    axios.get(config.urlBase + "get_menu.php", { withCredentials: true })
        .then(response => {
            if (response.data.error) {
                console.log(response.data.error);
                window.location.href = "pages/login.html";
                return;
            }

            let navbar = $("#navbar-items");
            let sidebar = $("#sidebar-items");

            navbar.empty();
            sidebar.empty();


            // Función para generar items del menú
            const generateMenuItem = (item) => {
                if (item.external) {
                    return `<a href="${item.url}" target="_blank" class="nav-link">
                    ${item.nombre}
                    </a>`;
                } else {
                    return `<a href="#" onclick="loadPage('${item.url.replace(/'/g, "\\'")}')" class="nav-link">
                    ${item.nombre}
                    </a>`;
                }
            };

            // Navbar
            response.data.navbar.forEach(item => {
                navbar.append(`<li class="nav-item">${generateMenuItem(item)}</li>`);
            });

            // Sidebar
            response.data.sidebar.forEach(item => {
                sidebar.append(`<li>${generateMenuItem(item)}</li>`);
            });


            $('head').append(`
            <style>
                a.external-link::after {
                    content: " ↗";
                    font-size: 0.8em;
                    opacity: 0.7;
                }
            </style>
        `);
        })
        .catch(error => {
            console.error("Error al obtener menús:", error);
            window.location.href = "pages/login.html";
        });

})