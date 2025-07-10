import { Button } from "@/components/ui/button";

const FeaturesSection = () => {
  return (
    <section className="py-12 bg-white">
      <h2 className="text-4xl font-bold text-center mb-8">
        Why Choose Claim Request?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-2">Easy Claim Creation</h3>
          <p>
            Create and save claims as drafts with a user-friendly interface.
          </p>
          <Button className="mt-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white">
            Learn More
          </Button>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-2">
            Seamless Approval Workflow
          </h3>
          <p>Submit claims for approval with automated notifications.</p>
          <Button className="mt-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white">
            Learn More
          </Button>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-2">Real-Time Tracking</h3>
          <p>Monitor your claims—Draft, Pending, Approved—at a glance.</p>
          <Button className="mt-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
