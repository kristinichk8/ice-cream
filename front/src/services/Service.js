import axios from "axios";
class Service {
    logout() {
        localStorage.removeItem("token");
    }
    getCurrentUser() {
        const token = localStorage.getItem('token');
        return token ? { accessToken: token } : null;
      }
      
      isLoggedIn() {
        const user = this.getCurrentUser();
        return !!user && !!user.accessToken;
      }
      
    getAllUsers() {
        const user = this.getCurrentUser();
        const config = {
            headers: { Authorization: `Bearer ${user.accessToken}` }
        };
        return axios.get("http://localhost:8081/admin/users", config);
    }
    
    getProductById(id) {
        return axios.get(`http://localhost:8081/isproduct/${id}`,  { params: { id } });
    }
    updatePass(username, password, newpassword) {
        return axios.put("http://localhost:8081/newpass", {
            username,
            password,
            newpassword
        })
    }
    
    
    getOrders(userId) {  
        return axios.get(`http://localhost:8081/orders/${userId}`, { params: { userId } })
    }
    refreshRole(userId, newRole) {
        return axios.put(`http://localhost:8081/refreshrole/${userId}`, { newRole })
    }
    getCors(userId) {
        return axios.get(`http://localhost:8081/cors/${userId}`, {params: {userId}})
    }
    updateAmountCors(userId, tovId, newAmount) {
        return axios
            .put("http://localhost:8081/cors/amount", {
                userId,
                tovId,
                newAmount
            })
    }
    dropProductCors(userId, tovId) {
        return axios.delete("http://localhost:8081/cors/drop", {
            data: { userId, tovId } // Передача данных в теле запроса
        });
    }
    addProductCors(userId, tovId) {
        return axios
            .post("http://localhost:8081/cors/add", {
                userId,
                tovId
            })
    }
    checkCors(userId, tovId) {
        return axios
            .post("http://localhost:8081/cors/check", {
                userId,
                tovId
            })
    }
}

export default new Service()