import ProfileHeader from "../components/profile/ProfileHeader";
import PersonalInformation from "../components/profile/PersonalInformation";
import AddressList from "../components/profile/AddressList";
import OrdersPreview from "../components/profile/OrdersPreview";
import AccountSummary from "../components/profile/AccountSummary";
import SecurityCard from "../components/profile/SecurityCard";

function Profile() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <ProfileHeader />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <PersonalInformation />
          <AddressList />
          <OrdersPreview />
        </div>

        <aside className="space-y-8">
          <AccountSummary />
          <SecurityCard />
        </aside>
      </div>
    </div>
  );
}

export default Profile;