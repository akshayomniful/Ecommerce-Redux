import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { switchTenant } from "../store/slices/authSlice";

const TenantSelector = () => {
  const dispatch = useDispatch();
  const { selectedTenantId, availableTenants } = useSelector(
    (state) => state.auth
  );

  const handleTenantChange = (e) => {
    const tenantId = e.target.value;
    console.log("Switching to tenant:", tenantId);
    if (tenantId !== selectedTenantId) {
      dispatch(switchTenant(tenantId));
    }
  };

  if (!availableTenants || availableTenants.length === 0) {
    return <div className="text-gray-500">No tenants available</div>;
  }

  console.log("Available tenants:", availableTenants);
  console.log("Selected tenant ID:", selectedTenantId);

  return (
    <div className="flex items-center">
      <label htmlFor="tenant-select" className="mr-2 text-sm font-medium">
        Tenant:
      </label>
      <select
        id="tenant-select"
        value={selectedTenantId || ""}
        onChange={handleTenantChange}
        className="form-select p-1 text-black rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      >
        {!selectedTenantId && <option value="">Select tenant</option>}
        {availableTenants.map((tenant) => (
          <option key={tenant.id} value={tenant.id}>
            {tenant.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TenantSelector;
