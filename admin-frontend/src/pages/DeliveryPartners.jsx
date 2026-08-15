import {
  EntityPage,
  Badge,
  ActionButtons,
  tdName,
  tdMute,
  tdNum,
} from "../components/EntityPage.jsx";
import { Star } from "lucide-react";

const columns = [
  "Name",
  "Email",
  "Phone",
  "Vehicle",
  "License #",
  "Rating",
  "Deliveries",
  "Approved",
  "Actions",
];

const renderRow = (item, onApprove, onDelete) => (
  <tr key={item._id}>
    <td {...tdName}>{item.name}</td>
    <td {...tdMute}>{item.email}</td>
    <td {...tdMute} className="nums">
      {item.phone}
    </td>
    <td {...tdMute}>{item.typeOfVehicle || "—"}</td>
    <td {...tdMute}>{item.licenseNumber}</td>
    <td>
      <span
        className="inline-flex items-center gap-1 nums"
        style={{ color: "var(--color-ink)", fontWeight: 600 }}
      >
        <Star
          style={{
            width: 14,
            height: 14,
            color: "var(--color-donor)",
            fill: "var(--color-donor)",
          }}
        />
        {item.rating || 0}
      </span>
    </td>
    <td {...tdNum}>{item.totalDeliveries || 0}</td>
    <td>
      <Badge condition={item.approved} />
    </td>
    <td>
      <ActionButtons
        approved={item.approved}
        onApprove={onApprove}
        onDelete={onDelete}
      />
    </td>
  </tr>
);

const DeliveryPartners = () => (
  <EntityPage
    title="Delivery Partners"
    sub="Riders transporting donations from donor to NGO"
    apiPath="delivery"
    columns={columns}
    renderRow={renderRow}
  />
);
export default DeliveryPartners;
