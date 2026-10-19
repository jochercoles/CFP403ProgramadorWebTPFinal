const loginView = document.getElementById("login-view");
const siteView = document.getElementById("site-view");
const dashboardHome = document.getElementById("dashboard-home");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-submit");
const logoutButton = document.getElementById("logout-button");
const suppliersView = document.getElementById("suppliers-view");
const productsView = document.getElementById("products-view");
const rolesView = document.getElementById("roles-view");
const navLinks = document.querySelectorAll("nav a");
const productForm = document.getElementById("product-form");
const supplierForm = document.getElementById("supplier-form");
const roleForm = document.getElementById("role-form");
const productTableBody = document.getElementById("products-table-body");
const supplierTableBody = document.getElementById("suppliers-table-body");
const roleTableBody = document.getElementById("roles-table-body");
const productSearchInput = document.getElementById("products-search");
const productSupplierSelect = document.getElementById("product-supplier");
const supplierRoleSelect = document.getElementById("supplier-role");
const productMessage = document.getElementById("products-message");
const supplierMessage = document.getElementById("suppliers-message");
const roleMessage = document.getElementById("roles-message");
const productSubmit = document.getElementById("product-submit");
const supplierSubmit = document.getElementById("supplier-submit");
const roleSubmit = document.getElementById("role-submit");
const productCancel = document.getElementById("product-cancel");
const supplierCancel = document.getElementById("supplier-cancel");
const roleCancel = document.getElementById("role-cancel");
const supplierCredentials = document.getElementById("supplier-credentials");
const supplierUsername = document.getElementById("supplier-username");
const supplierPassword = document.getElementById("supplier-password");
const supplierPasswordLabel = document.getElementById("supplier-password-label");
const supplierPasswordHint = document.getElementById("supplier-password-hint");
const productFormTitle = document.getElementById("product-form-title");
const supplierFormTitle = document.getElementById("supplier-form-title");
const roleFormTitle = document.getElementById("role-form-title");

let products = [];
let suppliers = [];
let roles = [];
let editingProductId = null;
let editingSupplierId = null;
let editingRoleId = null;
let productSearchTimeout = null;
let productSearchRequestId = 0;

function showLoginError(message) {
    loginError.textContent = message;
    loginError.classList.remove("hidden");
    loginError.hidden = false;
}

function clearLoginError() {
    loginError.textContent = "";
    loginError.classList.add("hidden");
    loginError.hidden = true;
}

function showSite() {
    loginView.classList.add("hidden");
    loginView.hidden = true;
    siteView.classList.remove("hidden");
    siteView.hidden = false;
    dashboardHome.hidden = false;
    document.title = "Proveedores y productos";
}

function showLogin() {
    if (localStorage.getItem("authenticatedSupplier") !== null) {
        localStorage.removeItem("authenticatedSupplier");
    }
    siteView.classList.add("hidden");
    siteView.hidden = true;
    productsView.classList.add("hidden");
    productsView.hidden = true;
    suppliersView.classList.add("hidden");
    suppliersView.hidden = true;
    rolesView.classList.add("hidden");
    rolesView.hidden = true;
    loginView.classList.remove("hidden");
    loginView.hidden = false;
    loginForm.reset();
    clearLoginError();
    document.title = "Acceso | Comercio";
    emailInput.focus();
}

// Metódo para realizar llamadas HTTP a la API, manejando errores y parseando la respuesta.
async function CallHttpMethod(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: "application/json",
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...options.headers
        }
    });

    const responseText = await response.text();
    let result = null;
    if (responseText) {
        try {
            result = JSON.parse(responseText);
        } catch {
            result = responseText;
        }
    }

    if (!response.ok) {
        const detail = typeof result === "string"
            ? result
            : result?.detail || result?.message || result?.error;
        throw new Error(detail || `El servidor respondió con el estado ${response.status}.`);
    }

    return result;
}

function setMessage(element, message, kind = "success") {
    element.textContent = message;
    element.classList.remove("hidden", "bg-green-50", "text-green-800", "bg-red-50", "text-red-700");
    element.classList.add(kind === "error" ? "bg-red-50" : "bg-green-50");
    element.classList.add(kind === "error" ? "text-red-700" : "text-green-800");
    element.hidden = false;
}

function clearMessage(element) {
    element.textContent = "";
    element.classList.add("hidden");
    element.hidden = true;
}

function appendCell(row, value, className = "px-5 py-3 text-slate-700") {
    const cell = document.createElement("td");
    cell.className = className;
    cell.textContent = value === null || value === undefined || value === "" ? "—" : String(value);
    row.append(cell);
}

function makeActionButton(label, action, style) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.className = style;
    button.addEventListener("click", action);
    return button;
}

function appendActionsCell(row, onEdit, onDelete) {
    const cell = document.createElement("td");
    cell.className = "whitespace-nowrap px-5 py-3";
    const actions = document.createElement("div");
    actions.className = "flex gap-3";
    actions.append(
        makeActionButton("Editar", onEdit, "font-medium text-indigo-600 hover:text-indigo-800"),
        makeActionButton("Eliminar", onDelete, "font-medium text-red-600 hover:text-red-800")
    );
    cell.append(actions);
    row.append(cell);
}

function renderProducts(displayedProducts = products) {
    productTableBody.replaceChildren();

    if (displayedProducts.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 8;
        cell.className = "px-5 py-8 text-center text-slate-500";
        cell.textContent = productSearchInput.value.trim()
            ? "No se encontraron productos coincidentes."
            : "No hay productos registrados.";
        row.append(cell);
        productTableBody.append(row);
        return;
    }

    const suppliersById = new Map(suppliers.map(supplier => [String(supplier.id), supplier]));
    for (const product of displayedProducts) {
        const row = document.createElement("tr");
        appendCell(row, product.id);
        appendCell(row, product.description);
        appendCell(row, new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS"
        }).format(Number(product.price)));
        appendCell(row, product.stock);
        appendCell(row, product.minimumlStock);
        appendCell(row, suppliersById.get(String(product.supplierId))?.socialReason || `ID ${product.supplierId}`);
        appendCell(row, product.observation);
        appendActionsCell(
            row,
            () => startProductEdit(product),
            () => deleteProduct(product)
        );
        productTableBody.append(row);
    }
}

function renderSuppliers() {
    supplierTableBody.replaceChildren();

    if (suppliers.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 9;
        cell.className = "px-5 py-8 text-center text-slate-500";
        cell.textContent = "No hay proveedores registrados.";
        row.append(cell);
        supplierTableBody.append(row);
    } else {
        const rolesById = new Map(roles.map(role => [String(role.id), role]));
        for (const supplier of suppliers) {
            const row = document.createElement("tr");
            appendCell(row, supplier.id);
            appendCell(row, supplier.socialReason);
            appendCell(row, `${supplier.responsableName || ""} ${supplier.responsableLastName || ""}`.trim());
            appendCell(row, supplier.cuit);
            appendCell(row, supplier.phone);
            appendCell(row, supplier.email);
            appendCell(row, supplier.address);
            const role = rolesById.get(String(supplier.roleId));
            appendCell(row, role?.description || (supplier.roleId ? `ID ${supplier.roleId}` : ""));
            appendActionsCell(
                row,
                () => startSupplierEdit(supplier),
                () => deleteSupplier(supplier)
            );
            supplierTableBody.append(row);
        }
    }

    updateProductSupplierOptions();
    updateSupplierRoleOptions();
}

function renderRoles() {
    roleTableBody.replaceChildren();

    if (roles.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 3;
        cell.className = "px-5 py-8 text-center text-slate-500";
        cell.textContent = "No hay roles registrados.";
        row.append(cell);
        roleTableBody.append(row);
        return;
    }

    for (const role of roles) {
        const row = document.createElement("tr");
        appendCell(row, role.id);
        appendCell(row, role.description);
        appendActionsCell(
            row,
            () => startRoleEdit(role),
            () => deleteRole(role)
        );
        roleTableBody.append(row);
    }
}

function updateSupplierRoleOptions(selectedId = supplierRoleSelect.value) {
    supplierRoleSelect.replaceChildren();
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = roles.length ? "Rol" : "No hay roles disponibles";
    supplierRoleSelect.append(placeholder);

    for (const role of roles) {
        const option = document.createElement("option");
        option.value = role.id;
        option.textContent = role.description;
        supplierRoleSelect.append(option);
    }

    supplierRoleSelect.value = selectedId || "";
}

function updateProductSupplierOptions(selectedId = productSupplierSelect.value) {
    productSupplierSelect.replaceChildren();
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = suppliers.length ? "Proveedor" : "Primero registra un proveedor";
    productSupplierSelect.append(placeholder);

    for (const supplier of suppliers) {
        const option = document.createElement("option");
        option.value = supplier.id;
        option.textContent = `${supplier.socialReason}`;
        productSupplierSelect.append(option);
    }

    productSupplierSelect.value = selectedId || "";
}

async function loadSupplierData() {
    const [loadedSuppliers, loadedRoles] = await Promise.all([
        CallHttpMethod("/api/suppliers"),
        CallHttpMethod("/api/roles")
    ]);
    suppliers = loadedSuppliers;
    roles = loadedRoles;
}

async function loadRoles() {
    clearMessage(roleMessage);
    roleTableBody.replaceChildren();

    try {
        roles = await CallHttpMethod("/api/roles");
        renderRoles();
        updateSupplierRoleOptions();
        renderSuppliers();
        return true;
    } catch (error) {
        console.error("No se pudieron cargar los roles:", error);
        setMessage(roleMessage, `No se pudieron cargar los roles: ${error.message}`, "error");
        return false;
    }
}

async function loadProducts() {
    clearMessage(productMessage);
    productTableBody.replaceChildren();
    productSearchRequestId++;

    try {
        const authenticatedSupplier = JSON.parse(localStorage.getItem("authenticatedSupplier"));

        // Si es administrador (roleId === 1), cargamos todos los productos y proveedores. 
        // Si no, solo cargamos los productos del proveedor autenticado.
        if (!authenticatedSupplier || authenticatedSupplier.roleId === 1) {
            const [loadedProducts] = await Promise.all([
                CallHttpMethod("/api/products"),
                loadSupplierData()
            ]);

            products = loadedProducts;
        }
        else {
            const [loadedProducts] = await Promise.all([
                CallHttpMethod(`/api/products/suppliers/${authenticatedSupplier.id}`),
                loadSupplierData()
            ]);

            products = loadedProducts;
        }

        renderSuppliers();
        const searchTerm = productSearchInput.value.trim();
        if (searchTerm) {
            if (!await searchProducts(++productSearchRequestId)) {
                return false;
            }
        } else {
            renderProducts();
        }
        return true;
    } catch (error) {
        console.error("No se pudieron cargar los productos, proveedores y roles:", error);
        setMessage(productMessage, `No se pudieron cargar los productos, proveedores y roles: ${error.message}`, "error");
        return false;
    }
}

async function searchProducts(requestId) {
    const searchTerm = productSearchInput.value.trim();
    if (!searchTerm) {
        clearMessage(productMessage);
        renderProducts();
        return true;
    }

    try {
        const authenticatedSupplier = JSON.parse(localStorage.getItem("authenticatedSupplier"));
        let matchingProducts;
        if (!authenticatedSupplier || authenticatedSupplier.roleId === 1) {
            matchingProducts = await CallHttpMethod(
                `/api/products/search?value=${encodeURIComponent(searchTerm)}`
            );
        } else {
            const normalizedSearchTerm = searchTerm.toLocaleLowerCase();
            matchingProducts = products.filter(product =>
                `${product.description ?? ""} ${product.observation ?? ""}`
                    .toLocaleLowerCase()
                    .includes(normalizedSearchTerm)
            );
        }

        if (requestId === productSearchRequestId) {
            clearMessage(productMessage);
            renderProducts(Array.isArray(matchingProducts) ? matchingProducts : []);
            return true;
        }
        return false;
    } catch (error) {
        if (requestId === productSearchRequestId) {
            console.error("No se pudieron buscar productos:", error);
            setMessage(productMessage, `No se pudieron buscar productos: ${error.message}`, "error");
        }
        return false;
    }
}

async function loadSuppliers() {
    clearMessage(supplierMessage);
    supplierTableBody.replaceChildren();

    try {
        await loadSupplierData();
        renderSuppliers();
        return true;
    } catch (error) {
        console.error("No se pudieron cargar los proveedores y roles:", error);
        setMessage(supplierMessage, `No se pudieron cargar los proveedores y roles: ${error.message}`, "error");
        return false;
    }
}

function resetProductForm() {
    editingProductId = null;
    productForm.reset();
    productFormTitle.textContent = "Nuevo producto";
    productSubmit.textContent = "Crear producto";
    productCancel.classList.add("hidden");
    productCancel.hidden = true;
}

function startProductEdit(product) {
    editingProductId = product.id;
    productForm.elements.namedItem("description").value = product.description ?? "";
    productForm.elements.namedItem("price").value = product.price ?? "";
    productForm.elements.namedItem("stock").value = product.stock ?? "";
    productForm.elements.namedItem("minimumlStock").value = product.minimumlStock ?? "";
    productForm.elements.namedItem("observation").value = product.observation ?? "";
    updateProductSupplierOptions(String(product.supplierId ?? ""));
    productFormTitle.textContent = `Editar producto #${product.id}`;
    productSubmit.textContent = "Guardar cambios";
    productCancel.classList.remove("hidden");
    productCancel.hidden = false;
    productForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetSupplierForm() {
    editingSupplierId = null;
    supplierForm.reset();
    supplierFormTitle.textContent = "Nuevo proveedor";
    supplierSubmit.textContent = "Crear proveedor";
    supplierCredentials.classList.remove("hidden");
    supplierCredentials.hidden = false;
    supplierUsername.required = true;
    supplierPassword.required = true;
    supplierPasswordLabel.textContent = "Contraseña";
    supplierPasswordHint.classList.add("hidden");
    supplierPasswordHint.hidden = true;
    supplierCancel.classList.add("hidden");
    supplierCancel.hidden = true;
}

function startSupplierEdit(supplier) {
    const authenticatedSupplier = JSON.parse(localStorage.getItem("authenticatedSupplier"));
    const isAdmin = authenticatedSupplier?.roleId === 1;
    editingSupplierId = supplier.id;
    supplierForm.elements.namedItem("socialReason").value = supplier.socialReason ?? "";
    supplierForm.elements.namedItem("responsableName").value = supplier.responsableName ?? "";
    supplierForm.elements.namedItem("responsableLastName").value = supplier.responsableLastName ?? "";
    supplierForm.elements.namedItem("cuit").value = supplier.cuit ?? "";
    supplierForm.elements.namedItem("phone").value = supplier.phone ?? "";
    supplierForm.elements.namedItem("email").value = supplier.email ?? "";
    supplierForm.elements.namedItem("address").value = supplier.address ?? "";
    updateSupplierRoleOptions(String(supplier.roleId ?? ""));
    supplierCredentials.classList.toggle("hidden", !isAdmin);
    supplierCredentials.hidden = !isAdmin;
    supplierUsername.value = isAdmin ? supplier.username ?? "" : "";
    supplierUsername.required = isAdmin;
    supplierPassword.value = "";
    supplierPassword.required = false;
    supplierPasswordLabel.textContent = "Nueva contraseña (opcional)";
    supplierPasswordHint.classList.toggle("hidden", !isAdmin);
    supplierPasswordHint.hidden = !isAdmin;
    supplierFormTitle.textContent = `Editando el proveedor ${supplier.socialReason}`;
    supplierSubmit.textContent = "Guardar cambios";
    supplierCancel.classList.remove("hidden");
    supplierCancel.hidden = false;
    supplierForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetRoleForm() {
    editingRoleId = null;
    roleForm.reset();
    roleFormTitle.textContent = "Nuevo rol";
    roleSubmit.textContent = "Crear rol";
    roleCancel.classList.add("hidden");
    roleCancel.hidden = true;
}

function startRoleEdit(role) {
    editingRoleId = role.id;
    roleForm.elements.namedItem("description").value = role.description ?? "";
    roleFormTitle.textContent = `Editar rol #${role.id}`;
    roleSubmit.textContent = "Guardar cambios";
    roleCancel.classList.remove("hidden");
    roleCancel.hidden = false;
    roleForm.scrollIntoView({ behavior: "smooth", block: "start" });
    roleForm.elements.namedItem("description").focus();
}

productForm.addEventListener("submit", async event => {
    event.preventDefault();
    clearMessage(productMessage);
    productSubmit.disabled = true;

    const formData = new FormData(productForm);
    const product = {
        description: formData.get("description").trim(),
        price: Number(formData.get("price")),
        stock: Number(formData.get("stock")),
        minimumlStock: Number(formData.get("minimumlStock")),
        observation: formData.get("observation").trim(),
        supplierId: Number(formData.get("supplierId"))
    };

    try {
        const isEditing = editingProductId !== null;
        const url = isEditing ? `/api/products/${editingProductId}` : "/api/products";
        await CallHttpMethod(url, {
            method: isEditing ? "PUT" : "POST",
            body: JSON.stringify(product)
        });
        resetProductForm();
        if (await loadProducts()) {
            setMessage(productMessage, isEditing ? "Producto actualizado correctamente." : "Producto creado correctamente.");
        }
    } catch (error) {
        console.error("No se pudo guardar el producto:", error);
        setMessage(productMessage, `No se pudo guardar el producto: ${error.message}`, "error");
    } finally {
        productSubmit.disabled = false;
    }
});

supplierForm.addEventListener("submit", async event => {
    event.preventDefault();
    clearMessage(supplierMessage);
    supplierSubmit.disabled = true;

    const formData = new FormData(supplierForm);
    const supplier = {
        socialReason: formData.get("socialReason").trim(),
        responsableName: formData.get("responsableName").trim(),
        responsableLastName: formData.get("responsableLastName").trim(),
        cuit: formData.get("cuit").trim(),
        phone: formData.get("phone").trim(),
        email: formData.get("email").trim(),
        address: formData.get("address").trim(),
        roleId: Number(formData.get("roleId"))
    };
    const isEditing = editingSupplierId !== null;
    if (editingSupplierId === null) {
        supplier.username = formData.get("username").trim();
        supplier.password = formData.get("password");
    } else {
        const authenticatedSupplier = JSON.parse(localStorage.getItem("authenticatedSupplier"));
        if (authenticatedSupplier?.roleId === 1) {
            supplier.username = formData.get("username").trim();
            const password = formData.get("password");
            if (password) {
                supplier.password = password;
            }
        }
    }

    try {
        const url = isEditing ? `/api/suppliers/${editingSupplierId}` : "/api/suppliers";
        await CallHttpMethod(url, {
            method: isEditing ? "PUT" : "POST",
            body: JSON.stringify(supplier)
        });
        resetSupplierForm();
        if (await loadSuppliers()) {
            setMessage(supplierMessage, isEditing ? "Proveedor actualizado correctamente." : "Proveedor creado correctamente.");
        }
    } catch (error) {
        console.error("No se pudo guardar el proveedor:", error);
        setMessage(supplierMessage, `No se pudo guardar el proveedor: ${error.message}`, "error");
    } finally {
        supplierSubmit.disabled = false;
    }
});

roleForm.addEventListener("submit", async event => {
    event.preventDefault();
    clearMessage(roleMessage);
    roleSubmit.disabled = true;

    const description = new FormData(roleForm).get("description").trim();
    if (!description) {
        setMessage(roleMessage, "La descripción del rol no puede estar vacía.", "error");
        roleSubmit.disabled = false;
        roleForm.elements.namedItem("description").focus();
        return;
    }
    const isEditing = editingRoleId !== null;

    try {
        const url = isEditing ? `/api/roles/${editingRoleId}` : "/api/roles";
        await CallHttpMethod(url, {
            method: isEditing ? "PUT" : "POST",
            body: JSON.stringify({ description })
        });
        resetRoleForm();
        if (await loadRoles()) {
            setMessage(roleMessage, isEditing ? "Rol actualizado correctamente." : "Rol creado correctamente.");
        }
    } catch (error) {
        console.error("No se pudo guardar el rol:", error);
        setMessage(roleMessage, `No se pudo guardar el rol: ${error.message}`, "error");
    } finally {
        roleSubmit.disabled = false;
    }
});

async function deleteProduct(product) {
    if (!window.confirm(`¿Eliminar el producto "${product.description}"?`)) {
        return;
    }

    try {
        await CallHttpMethod(`/api/products/${product.id}`, { method: "DELETE" });
        if (editingProductId === product.id) {
            resetProductForm();
        }
        if (await loadProducts()) {
            setMessage(productMessage, "Producto eliminado correctamente.");
        }
    } catch (error) {
        console.error("No se pudo eliminar el producto:", error);
        setMessage(productMessage, `No se pudo eliminar el producto: ${error.message}`, "error");
    }
}

async function deleteSupplier(supplier) {
    if (!window.confirm(`¿Eliminar el proveedor "${supplier.socialReason}"?`)) {
        return;
    }

    try {
        await CallHttpMethod(`/api/suppliers/${supplier.id}`, { method: "DELETE" });
        if (editingSupplierId === supplier.id) {
            resetSupplierForm();
        }
        if (await loadSuppliers()) {
            setMessage(supplierMessage, "Proveedor eliminado correctamente.");
        }
    } catch (error) {
        console.error("No se pudo eliminar el proveedor:", error);
        setMessage(supplierMessage, `No se pudo eliminar el proveedor: ${error.message}`, "error");
    }
}

async function deleteRole(role) {
    if (!window.confirm(`¿Eliminar el rol "${role.description}"?`)) {
        return;
    }

    clearMessage(roleMessage);
    try {
        await CallHttpMethod(`/api/roles/${role.id}`, { method: "DELETE" });
        if (editingRoleId === role.id) {
            resetRoleForm();
        }
        if (await loadRoles()) {
            setMessage(roleMessage, "Rol eliminado correctamente.");
        }
    } catch (error) {
        console.error("No se pudo eliminar el rol:", error);
        setMessage(roleMessage, `No se pudo eliminar el rol. Puede estar asignado a uno o más proveedores. ${error.message}`, "error");
    }
}

loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    clearLoginError();
    loginButton.disabled = true;
    loginButton.textContent = "Validando...";

    const credentials = new URLSearchParams({
        email: emailInput.value,
        password: passwordInput.value
    });

    try {
        const authenticated = await CallHttpMethod(`/api/suppliers/login?${credentials.toString()}`);
        if (typeof authenticated == null || typeof authenticated !== "object" || !("id" in authenticated)) {
            throw new Error("La respuesta del servidor no tiene el formato esperado.");
        }

        if (authenticated) {
            const json = JSON.stringify(authenticated);
            localStorage.setItem("authenticatedSupplier", json);

            loginForm.reset();
            showSite();
            return;
        }

        showLoginError("El usuario o la contraseña no son correctos.");
        passwordInput.value = "";
        passwordInput.focus();
    } catch (error) {
        console.error("No se pudo validar el inicio de sesión:", error);
        showLoginError(error.message.includes("401")
            ? "El usuario o la contraseña no son correctos."
            : "No se pudo validar el acceso. Verifica tu conexión e inténtalo nuevamente.");
        passwordInput.value = "";
        passwordInput.focus();
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Iniciar sesión";
    }
});

init();

function init() {
    const currentAuthenticatedSupplier = localStorage.getItem("authenticatedSupplier");
    if (currentAuthenticatedSupplier) {
        loginForm.reset();
        showSite();
        return;        
    }
}

loginForm.addEventListener("input", clearLoginError);
logoutButton.addEventListener("click", showLogin);
productCancel.addEventListener("click", resetProductForm);
supplierCancel.addEventListener("click", resetSupplierForm);
roleCancel.addEventListener("click", resetRoleForm);
document.getElementById("products-refresh").addEventListener("click", loadProducts);
productSearchInput.addEventListener("input", () => {
    clearTimeout(productSearchTimeout);
    const requestId = ++productSearchRequestId;
    productSearchTimeout = setTimeout(() => searchProducts(requestId), 250);
});
document.getElementById("suppliers-refresh").addEventListener("click", loadSuppliers);
document.getElementById("roles-refresh").addEventListener("click", loadRoles);

navLinks.forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const showProducts = targetId === "products-view";
        const showSuppliers = targetId === "suppliers-view";
        const showRoles = targetId === "roles-view";

        siteView.classList.remove("hidden");
        siteView.hidden = false;
        dashboardHome.hidden = showProducts || showSuppliers || showRoles;
        productsView.classList.toggle("hidden", !showProducts);
        productsView.hidden = !showProducts;
        suppliersView.classList.toggle("hidden", !showSuppliers);
        suppliersView.hidden = !showSuppliers;
        rolesView.classList.toggle("hidden", !showRoles);
        rolesView.hidden = !showRoles;

        if (showProducts) {
            document.title = "Productos | Comercio";
            loadProducts();
        } else if (showSuppliers) {
            document.title = "Proveedores | Comercio";
            loadSuppliers();
        } else if (showRoles) {
            document.title = "Roles | Comercio";
            loadRoles();
        } else {
            document.title = "Proveedores y productos | Comercio";
        }
    });
});
