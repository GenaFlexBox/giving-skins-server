import adminService from "../config/admin-service.js";
import ApiError from "../exceptions/api-error.js";


class AdminConrtroller {
    async getWeaponList(req, res, next) {
        try {
          const weapons = await adminService.getWeaponList();
          res.json(weapons);
        } catch (error) {
          next(error);
        }
    }

    async addCases(req, res, next) {
      const { name, image, price, quota } = req.body
      try {
        const cases = await adminService.addCases(name, image, price, quota);
        res.json(cases);
      } catch (error) {
        next(error);
      }
  }
}

export default new AdminConrtroller();