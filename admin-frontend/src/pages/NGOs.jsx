import {
  EntityPage,
  Badge,
  ActionButtons,
  tdName,
  tdMute,
} from "../components/EntityPage.jsx";

const columns = [
  "Name",
  "Email",
  "Phone",
  "Contact person",
  "Registration #",
  "Type",
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
    <td>{item.contactPerson}</td>
    <td {...tdMute}>{item.RegistrationNumber}</td>
    <td {...tdMute}>{item.typeofNgo || "—"}</td>
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

const NGOs = () => (
  <EntityPage
    title="NGOs"
    sub="Receiving organizations across the platform"
    apiPath="ngos"
    columns={columns}
    renderRow={renderRow}
  />
);
export default NGOs;
