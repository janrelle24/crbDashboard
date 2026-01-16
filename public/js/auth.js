function authHeaders(extra = {}) {

    return {
        Authorization: "Bearer " + localStorage.getItem("token"),
        ...extra
    };
}

