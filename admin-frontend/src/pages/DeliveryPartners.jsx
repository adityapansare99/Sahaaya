import React from "react";
import { EntityPage, Badge, ActionButtons } from "../components/EntityPage.jsx";

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
  <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50">
    <td className="p-4 font-medium text-gray-900">{item.name}</td>
    <td className="p-4 text-gray-600">{item.email}</td>
    <td className="p-4 text-gray-600">{item.phone}</td>
    <td className="p-4 text-gray-600">{item.typeOfVehicle || "—"}</td>
    <td className="p-4 text-gray-600">{item.licenseNumber}</td>
    <td className="p-4 text-gray-900">{item.rating || 0}</td>
    <td className="p-4 text-gray-900">{item.totalDeliveries || 0}</td>
    <td className="p-4">
      <Badge condition={item.approved} />
    </td>
    <td className="p-4">
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
    apiPath="delivery"
    columns={columns}
    renderRow={renderRow}
  />
);
export default DeliveryPartners;
