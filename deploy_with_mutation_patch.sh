#!/bin/bash
# DUAL-LAYER MUTATION PATCH DEPLOYMENT SCRIPT
# Enforces static compliance through SSR bypass and artifact validation

echo "================================================"
echo "CALI-FIRE-TRACKER MUTATION PATCH DEPLOYMENT"
echo "================================================"

# Layer 1: SSR Detection Bypass
echo "[LAYER 1] Executing SSR detection bypass..."
python3 amplify_ssr_bypass.py

if [ $? -ne 0 ]; then
    echo "[ERROR] SSR bypass failed"
    echo "[LOGGING] Recording failure as contradiction artifact..."
    echo "{\"timestamp\": \"$(date -Iseconds)\", \"failure\": \"SSR_BYPASS\", \"hypothesis\": \"Python environment issue or file permissions\"}" > contradiction_$(date +%Y%m%d_%H%M%S).json
    exit 1
fi

# Execute masked build
echo "[BUILD] Running masked Next.js build..."
npm run build

if [ $? -ne 0 ]; then
    echo "[ERROR] Build failed"
    echo "[LOGGING] Recording build failure..."
    echo "{\"timestamp\": \"$(date -Iseconds)\", \"failure\": \"BUILD_EXECUTION\", \"hypothesis\": \"Masking incomplete or Next.js detection persists\"}" > contradiction_$(date +%Y%m%d_%H%M%S).json
    exit 1
fi

# Layer 2: Artifact Validity Enforcement
echo "[LAYER 2] Validating and sanitizing build artifacts..."
python3 artifact_validity_wrapper.py

if [ $? -ne 0 ]; then
    echo "[ERROR] Artifact validation failed"
    echo "[LOGGING] Recording validation failure..."
    echo "{\"timestamp\": \"$(date -Iseconds)\", \"failure\": \"ARTIFACT_VALIDATION\", \"hypothesis\": \"SSR contamination in build output\"}" > contradiction_$(date +%Y%m%d_%H%M%S).json
    exit 1
fi

# Restore package.json for Amplify (using masked version)
if [ -f "package.amplify.json" ]; then
    echo "[RESTORE] Swapping to masked package.json for deployment..."
    mv package.json package.original.json
    mv package.amplify.json package.json
fi

# Final mutation log
echo "[COMPLETE] Dual-layer mutation patch applied successfully"
echo "[LOGGING] Generating comprehensive mutation report..."

cat > deployment_mutation_log.json << EOF
{
  "deployment_id": "$(uuidgen)",
  "timestamp": "$(date -Iseconds)",
  "mutation_layers": [
    {
      "layer": 1,
      "type": "SSR_DETECTION_BYPASS",
      "status": "APPLIED",
      "mutations": ["package.json", "next.config", "synthetic_metadata"]
    },
    {
      "layer": 2,
      "type": "ARTIFACT_VALIDITY_WRAPPER",
      "status": "APPLIED",
      "sanitizations": ["ssr_logic_stripped", "forbidden_files_removed"]
    }
  ],
  "expected_behavior": "STATIC_ONLY_DEPLOYMENT",
  "monitoring": {
    "watch_for": ["required-server-files.json", "server trace files", "Lambda functions"],
    "contradiction_protocol": "Log and escalate if SSR behavior recurs"
  }
}
EOF

echo "[SUCCESS] Deployment ready with mutation patch applied"
echo "[NOTE] Monitor Amplify console for SSR recurrence"
echo "================================================"