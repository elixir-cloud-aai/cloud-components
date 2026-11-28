// Example outputs of the GA4GH IO Schema profile, pinned to commit
// 2c3dc49ad89f0a556272f160369a2a2d7a21dac3 of
// https://github.com/elixir-cloud-aai/ga4gh-io-schema: the outputs of the
// demo workflow (examples/demo/ga4gh-io.schema.json and
// examples/demo/expected/outputs.json), plus a list of files, files keyed by
// sample and a number from Example 1 (docs/specification/examples.md). The
// files that the viewers show are illustrative copies in
// public/wes-outputs/.
import type { WesOutputProvider } from '@elixir-cloud/wes/providers';
import { withBasePath } from '@/utils/basePath';

export const PROFILE_COMMIT = '2c3dc49ad89f0a556272f160369a2a2d7a21dac3';

const DEMO_RUN =
  's3://conquest/v1/workflow-runs/9f1c2e4a-5b6d-4e7f-8a9b-0c1d2e3f4a5b/outputs/files/miniwdl-runs/20261113_021212_io_schema_demo/out';

/** Schemas of the outputs (the `properties` of `outputs`). */
export const outputSchemas: Record<string, Record<string, unknown>> = {
  report: {
    type: 'string',
    'x-ga4gh-file': { kind: 'file', mediaType: 'text/html' },
    description: 'Statistics of the reads before and after filtering.',
    title: 'Alignment report (HTML)',
    'x-ga4gh-ui-widget': 'html-viewer',
  },
  read_counts: {
    type: 'string',
    'x-ga4gh-file': { kind: 'file', mediaType: 'text/tab-separated-values' },
    description:
      'Mapped and unmapped reads per reference sequence, before and after filtering; unmapped reads without a position are counted under *.',
    title: 'Read counts per reference (TSV)',
    'x-ga4gh-ui-widget': 'table-viewer',
  },
  filtered_bam: {
    type: 'string',
    'x-ga4gh-file': {
      kind: 'file',
      ontology: 'http://edamontology.org/format_2572',
    },
    description: 'The filtered reads, sorted by coordinate.',
    title: 'Filtered reads (BAM)',
  },
  alignments: {
    type: 'array',
    title: 'Aligned Reads',
    description: 'One BAM file per sample, each with its index next to it.',
    items: {
      type: 'string',
      'x-ga4gh-file': {
        kind: 'file',
        ontology: 'http://edamontology.org/format_2572',
        secondaryFiles: ['.bai'],
      },
    },
  },
  gene_counts: {
    type: 'object',
    title: 'Gene Counts',
    description: 'Gene counts per sample, keyed by sample ID.',
    additionalProperties: {
      type: 'string',
      'x-ga4gh-file': { kind: 'file', mediaType: 'text/tab-separated-values' },
      'x-ga4gh-ui-widget': 'table-viewer',
    },
  },
  samples_passed_qc: {
    type: 'integer',
    minimum: 0,
    title: 'Samples Passing QC',
  },
};

/** The normalised outputs object of a run. */
export const outputs: Record<string, unknown> = {
  report: `${DEMO_RUN}/report/report.html`,
  read_counts: `${DEMO_RUN}/read_counts/read_counts.tsv`,
  filtered_bam: `${DEMO_RUN}/filtered_bam/filtered.bam`,
  alignments: [
    's3://example-bucket/runs/7/alignments/s1.bam',
    's3://example-bucket/runs/7/alignments/s2.bam',
  ],
  gene_counts: {
    s1: 's3://example-bucket/runs/7/counts/s1.tsv',
    s2: 's3://example-bucket/runs/7/counts/s2.tsv',
  },
  samples_passed_qc: 2,
};

/** Copies of the files that the docs serve, by URI of the output. */
const copies: Record<string, string> = {
  [`${DEMO_RUN}/report/report.html`]: '/wes-outputs/report.html',
  [`${DEMO_RUN}/read_counts/read_counts.tsv`]: '/wes-outputs/read_counts.tsv',
  's3://example-bucket/runs/7/counts/s1.tsv': '/wes-outputs/s1.tsv',
  's3://example-bucket/runs/7/counts/s2.tsv': '/wes-outputs/s2.tsv',
};

const copyOf = (uri: string): string => {
  const path = copies[uri];
  if (!path) throw new Error('the docs have no copy of this file');
  return withBasePath(path);
};

/**
 * A provider that serves the copies in public/wes-outputs/. A real app
 * turns `s3://` URIs into presigned URLs or URLs of a proxy, and adds
 * credentials.
 */
export const exampleOutputProvider: WesOutputProvider = {
  fetchOutput: async (uri, init) => fetch(copyOf(uri), init),
  getDownloadUrl: async (uri) => copyOf(uri),
};
