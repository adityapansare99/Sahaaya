import {
  EntityPage,
  Badge,
  ActionButtons,
  tdName,
  tdMute,
  tdNum,
} from "../components/EntityPage.jsx";

const columns = [
  "Name",
  "Email",
  "Phone",
  "Discount %",
  "Points required",
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
    <td {...tdNum} style={{ color: "var(--color-donor-2)" }}>
      {item.discountPercentage}%
    </td>
    <td {...tdNum}>{item.pointsRequired}</td>
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

const RestaurantPartners = () => (
  <EntityPage
    title="Restaurant Partners"
    sub="Partners offering point-redemption rewards to riders"
    apiPath="partners"
    columns={columns}
    renderRow={renderRow}
  />
);
export default RestaurantPartners;
