//let urlData =
// "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";
let urlData = "./data.json";
const promesaData = new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.open('GET', urlData);
    req.onload = function () {
        if (req.status === 200) {
            resolve(JSON.parse(req.response));
        } else {
            reject("No se recibió el detalle");
        }
    };
    req.send()
});

let selectedCategory = undefined;

promesaData.then(categorias=>{
    const navigationBar = document.getElementById("navigation-bar");
    const centralRegion = document.getElementById("central-region");
    const centralRegionTitle = document.getElementById("category-name");
    categorias.forEach((categoria,i)=>{
        if(i===0){
            selectedCategory = categoria.name;
        }
        let listItem = document.createElement("li");
        listItem.setAttribute("class", "nav-item")
        let link = document.createElement("a");
        link.setAttribute("class", "nav-link")
        // link.setAttribute("href", "#")
        link.textContent = categoria.name;
        listItem.appendChild(link);
        navigationBar.appendChild(listItem);
        link.onclick = ()=>{
            selectedCategory  = categoria.name;
            centralRegion.innerHTML = "";
            centralRegionTitle.textContent = selectedCategory;
            categoria.products.forEach(producto=>{

            });
            console.log(centralRegionTitle.textContent)

        }
    });
}).catch(err => console.log(err))


function onSection(){
    console.log("Hello")
}


// < li
// className = "nav-item" >
//     < a
// class Name = "nav-link disabled"
// href = "#" > Disabled < /a>
// </li>