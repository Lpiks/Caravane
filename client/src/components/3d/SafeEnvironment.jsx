'use client';

import React from 'react';
import { Environment } from '@react-three/drei';

class EnvironmentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("SafeEnvironment: Failed to load environment preset. Falling back to default lighting.", error.message || error);
  }

  render() {
    if (this.state.hasError) {
      return null; // Fail silently, letting ambient/directional lights illuminate the scene
    }
    return this.props.children;
  }
}

export default function SafeEnvironment(props) {
  return (
    <EnvironmentErrorBoundary>
      <Environment {...props} />
    </EnvironmentErrorBoundary>
  );
}
