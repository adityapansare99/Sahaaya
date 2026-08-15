import {
  EntityPage,
  Badge,
  ActionButtons,
  tdName,
  tdMute,
} from "../components/EntityPage.jsx";

const columns = ["Name", "Email", "Phone", "Address", "Approved", "Actions"];

const renderRow = (item, onApprove, onDelete) => (
  <tr key={item._id}>
    <td {...tdName}>{item.name}</td>
    <td {...tdMute}>{item.email}</td>
    <td {...tdMute} className="nums">
      {item.phone}
    </td>
    <td {...tdMute}>{item.address}</td>
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

const Donors = () => (
  <EntityPage
    title="Donors"
    sub="Restaurants, events, stores & individuals posting surplus"
    apiPath="donors"
    columns={columns}
    renderRow={renderRow}
  />
);
export default Donors;
