import database from "../../config/database.config";
import Equipment from "./equipment.entity";

class EquipmentService {
  private equipmentRepository = database.getRepository(Equipment);
}

export default EquipmentService;
