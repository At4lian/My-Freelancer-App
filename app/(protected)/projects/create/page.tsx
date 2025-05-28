import React from 'react';
import NewProjectForm from '@/components/create-project';

const CreateProjectPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10">
      <NewProjectForm />
    </div>
  );
};

export default CreateProjectPage;