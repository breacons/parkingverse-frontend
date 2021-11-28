import React from 'react';

interface TooltipItemProps {
  title: string;
  description: string;
  icon: any;
}

export const TooltipItem = ({ title, description, icon }: TooltipItemProps) => <div>{title}</div>;

