import ApiError from "../exceptions/api-error.js";
import weaponModel from "../model/weaponModel.js";


class AdminService {

    async getWeaponList() {
       const weaponList = await weaponModel.find();

       return weaponList
    }

    async addCases() {
      
        const weaponList = await weaponModel.find();
 
        return weaponList
     }
}

export default new AdminService();