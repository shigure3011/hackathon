function createAElement(href, text) {
    let a = document.createElement("a");
    a.href = href;
    a.innerText = text;
    return a;
}

function createDivElement(id, text) {
    let div = document.createElement("div");
    div.className = "content";
    div.id = id;
    if (id === "link") {
        div.innerHTML = `<a href="${text}" style="text-decoration: none; color: purple">${text}</a>`
    } else
        div.innerText = text;
    return div;
}

//Create navigator element
function createNavElement(p) {
    let container = document.createElement("div");
    container.className = "tabs";

    let nav = document.createElement("nav");
    nav.appendChild(createAElement("#full-name", "Tên"));
    nav.appendChild(createAElement("#symp", "Triệu chứng"));
    nav.appendChild(createAElement("#link", "Chi tiết"));

    container.appendChild(nav);

    let name = createDivElement("full-name","");
    let fullName = document.createElement("p");
    fullName.innerText = `Tên đầy đủ: ${p.fullName}`;
    let engName = document.createElement("p");
    engName.innerText = `Tên khoa hoc: ${p.engName}`;
    name.appendChild(fullName).appendChild(engName);
    container.appendChild(name);

    container.appendChild(createDivElement("symp", p.symptom));
    container.appendChild(createDivElement("link", p.link));

    return container;
}

// Apply style to navigator element
function handlePredict()
{
    $('nav').each(function() {
        let $active, $content, $links = $(this).find('a');
        $active = $($links.filter('[href="' + location.hash + '"]')[0] || $links[0]);
        $active.addClass('active');

        $content = $($active[0].hash);

        $links.not($active).each(function() {
            $(this.hash).hide();
        });

        $(this).on('click', 'a', function(e) {
            $active.removeClass('active');
            $content.hide();

            $active = $(this);
            $content = $(this.hash);

            $active.addClass('active');
            $content.show();

            e.preventDefault();
        });
    });
};

// Display loading button while analyzing
function addLoadingButton() {
    $("#prediction-list").empty();
    $("#prediction-list").append(`
    <svg>
        <circle cx="70" cy="70" r="70"></circle>
    </svg>
    `)
}

// Show probability and analysis result
function addProbabilityTab(p) {
    let e = document.getElementById("prediction-list");

    let box = document.createElement("div");
    box.className = "result";
    box.innerText = "Kết quả: ";

    let result = document.createElement("span");
    if (p.probability > 0.7) {
        result.innerText = `${p.probability.toFixed(3)} (Nguy cơ cao)`
        result.style.setProperty("color", "red");
    }

    else if (p.probability > 0.5) {
        result.innerText = `${p.probability.toFixed(3)} (Nguy cơ thấp)`
        result.style.setProperty("color", "orange");
    }

    else {
        result.innerText = `${p.probability.toFixed(3)} (Bình thường)`
        result.style.setProperty("color", "green");
    }

    box.appendChild(result);
    e.appendChild(box);
}

//Send POST request
const form = document.querySelector('form');
form.addEventListener('submit', function(ev) {

    ev.preventDefault();
    $("#prediction-list").empty();

    addLoadingButton();

    let xhr = new XMLHttpRequest();
    let img = new FormData();
    img.append("image", imgToBase64(document.getElementById("preview-image")));

    xhr.open("POST", "/predict", true);
    xhr.onreadystatechange = () => {
        $("#prediction-list").empty();
        if (xhr.readyState === XMLHttpRequest.DONE) {
            let status = xhr.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                let p = JSON.parse(xhr.response);
                document.getElementById("prediction-list").appendChild(createNavElement(p));
                addProbabilityTab(p);

                handlePredict();
            } else {
                $("#prediction-list").append(`<p style="list-style-type:none; color: white">${JSON.parse(xhr.response).err}</p>`);
            }
        } else {
            $("#prediction-list").append(`<p style="list-style-type:none; color: white">Analyzing...</p>`);
        }
    }
    setTimeout(function() {
        xhr.send(img);
    }, 1000);
});

