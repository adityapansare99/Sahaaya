import React from "react";
import { EntityPage, Badge, ActionButtons } from "../components/EntityPage.jsx";

const columns = ["Name", "Email", "Phone", "Discount %", "Points Required", "Approved", "Actions"];

const renderRow = (item, onApprove, onDelete) => (
  <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50">
    <td className="p-4 font-medium text-gray-900">{item.name}</td>
    <td className="p-4 text-gray-600">{item.email}</td>
    <td className="p-4 text-gray-600">{item.phone}</td>
    <td className="p-4 text-gray-900">{item.discountPercentage}%</td>
    <td className="p-4 text-gray-900">{item.pointsRequired}</td>
    <td className="p-4"><Badge condition={item.approved} /></td>
    <td className="p-4"><ActionButtons approved={item.approved} onApprove={onApprove} onDelete={onDelete} /></td>
  </tr>
);

const RestaurantPartners = () => <EntityPage title="Restaurant Partners" apiPath="partners" columns={columns} renderRow={renderRow} />;
export default RestaurantPartners;
